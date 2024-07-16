/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response, NextFunction } from "express";
const api: Express = express();

// Dotenv library used for environment variables
const dotenv = require('dotenv');
dotenv.config();

import { authToken } from "../../functions/token";

/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////

// CORS middleware
import CorsConfig from "../../middlewares/CorsConfig";
const cors = require('cors');
const corsOptions = CorsConfig.getCorsConfig();
api.use(cors(corsOptions));

// Body Parser Middleware to check data body from http request & configuration
import { urlEncodedParserMiddleware, jsonParserMiddleware } from "../../middlewares/body-parser";
api.use(urlEncodedParserMiddleware);
api.use(jsonParserMiddleware);


/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////

// Mysql library importation and pool connexion creation
import DatabaseConfig from "../../classes/DatabaseConfig";
import mysql, { PoolConnection } from 'mysql';
import { isMaxConnectionReached } from '../../functions/pool';
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());

// Validator library importation to check and clean datas from request
import validator from 'validator';

// Bcrypt library used to hash passwords
import bcrypt from 'bcryptjs';

// Jsonwebtoken to generate a token
const jwt = require('jsonwebtoken');
import { CsrfToken, CsrfTokenType } from "../../classes/CsrfToken";

// importation of the QueryBuild class
import QueryBuild from "../../classes/QueryBuild";

// importation of notifications messages
import { notificationMessages } from "../../datas/notifications";
import { getJsonResponse } from "../../functions/notifications";

import { sendActivationEmail } from "../../functions/activation-email";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////     SIGNIN      //////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
api.post('/register/signin', (req: Request, res: Response) => {

    // read the data from the POST request
    let { username, email, password } = req.body as { username: string, email: string, password: string };
    let action = req.query.action;

    // Check if the action is valid
    if (!action || action !== 'signin') {
        getJsonResponse(res, 400, 'invalid_action', notificationMessages, false);
        return;
    }
    // CHeck if the data is missing
    if (!username || !email || !password) {
        getJsonResponse(res, 400, 'missing-datas', notificationMessages, false);
        return;
    }

    // Cleaning the data to prevent XSS attacks
    username = validator.escape(username);
    email = validator.escape(email);
    password = validator.escape(password);

    // define default values
    let id_role: number = 2;
    let isActivated: boolean = false;
    let registrationDate: Date = new Date();
    const firstname: string = "null";
    const lastname: string = "null";

    // check if the email is valid with the validator method
    if (!validator.isEmail(email)) {
        getJsonResponse(res, 401, 'email_bad_format', notificationMessages, false);
        return;
    }


    // repeat salt process during 10 rounds
    const saltRounds: number = 10;

    // password = null;
    // hash the password with salt
    bcrypt.hash(password, saltRounds, function (error: Error | null, hash: string) {
        if (error) {
            // If there is a problem with the password verification (undefined ? null? problem with bcrypt library ?)
            getJsonResponse(res, 401, 'password_verification_failed', notificationMessages, false);
            return;
        } else {
            const hashpassword = hash;

            //  Get a database connection from the pool
            dbconnect.getConnection((error: Error, connection: PoolConnection) => {
                // Check if we can connect to the database
                if (error) {
                    getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
                    return;
                }

                // Check if we reached the maximum of connection allowed
                if (isMaxConnectionReached(dbconnect)) {
                    getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
                    connection.release();
                    return;
                }


                // If not then prepare and execute the SQL query to check if this user already exists
                const checkSql: string = 'SELECT * FROM users WHERE username = ? OR email = ?';

                // execute the query
                dbconnect.query(checkSql, [username, email], (error: Error | null, results: Object | undefined) => {

                    // if there is a database request error
                    if (error) {
                        getJsonResponse(res, 500, 'request_error', notificationMessages, false);
                        connection.release();
                        return;
                    }

                    // Convert the results object to an array
                    const queryResult = (results as Array<any>).length;

                    if (queryResult > 0) {
                        // if the user already exists
                        getJsonResponse(res, 401, 'exist_data', notificationMessages, false);
                        connection.release();
                        return;
                    }


                    // Get the secret key from the CsrfToken class
                    const csrfTokenKeys: CsrfTokenType = CsrfToken.getCsrfTokenKeys();
                    const secretKey: string | undefined = csrfTokenKeys.secretKey;

                    // Generate a token with user information and the secret key
                    const sessionToken = jwt.sign({
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                        email: email,
                    },
                        secretKey,
                        { expiresIn: '72h' });


                    // Prepare parameters for the activation email
                    const activationEmail = email;
                    const activationLink = 'https://www.thomas-bressel.com/activation?action=activate&token=' + sessionToken;

                    sendActivationEmail(activationEmail, activationLink)
                        .then(() => {

                            //  If not then prepare and execute the SQL query
                            const sql: string = `INSERT INTO users (firstname, lastname, username, email, hashpassword, isActivated, id_role, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                            // execute the query
                            dbconnect.query(sql, [firstname, lastname, username, email, hashpassword, isActivated, id_role, registrationDate], (error) => {
                                if (error) {
                                    getJsonResponse(res, 500, 'request_error', notificationMessages, false);
                                    connection.release();
                                    return;
                                }
                            });
                        })

                        .then(() => {
                            getJsonResponse(res, 200, 'signin_success', notificationMessages, true);
                            connection.release();
                        })

                        .catch((error) => {
                            getJsonResponse(res, 500, 'email_failure', notificationMessages, false);
                            connection.release();
                            return;
                        });
                });
            });
        }
    });
});

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
////////////////////////     ACTIVATE      //////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
api.get('/activation', async (req: any, res: Response) => {

    const { action, token } = req.query as { action: string, token: string };

    // Check if the action is valid
    if (!action || action !== 'activate') {
        getJsonResponse(res, 400, 'invalid_action', notificationMessages, false);
        return;
    }

    // Test if the token is missing or null of undefined
    if (!token || token === null || token === undefined) {
        getJsonResponse(res, 401, 'token_missing', notificationMessages, false);
        return;
    }

    // Get the secret key from the CsrfToken class
    const csrfTokenKeys: CsrfTokenType = CsrfToken.getCsrfTokenKeys();
    const secretKey: string | undefined = csrfTokenKeys.secretKey;


    // Verify the token with the secret key

    try {
        // Utilisation de async/await pour attendre la vérification du token
        const results = await new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error: Error, results: Object | undefined) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                    // Add the results to the request object with the jwt decoded 
                }
            });
        });

        req.results = results;

        console.log("Les résultats de la requête sont : ", results);

        // create variables to store the nickname and the email
        const username: string = req.results.username;
        const email: string = req.results.email;




        //  Get a database connection from the pool
        dbconnect.getConnection(async (error: Error, connection: PoolConnection) => {
            // Check if we can connect to the database
            if (error) {
                getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
                connection.release();
                return;
            }

            // Check if we reached the maximum of connection allowed
            if (isMaxConnectionReached(dbconnect)) {
                getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
                connection.release();
                return;
            }

            // If not then prepare and execute the SQL query to check if this user already exists
            const sql: string = 'UPDATE users SET isActivated = 1 WHERE username = ? AND email = ?';


            // execute the query
            dbconnect.query(sql, [username, email], (error: Error | null, results: Object | undefined) => {

                // if there is a database request error
                if (error) {
                    getJsonResponse(res, 500, 'request_error', notificationMessages, false);
                    connection.release();
                    return;
                }

                // If the account is well activated
                // getJsonResponse(res, 200, 'account_activated', notificationMessages, false);
                res.redirect('https://www.asmtariste.fr/');
                connection.release();


            });
        });
    } catch (error) {
        getJsonResponse(res, 403, 'token_failure', notificationMessages, false);
        return;
    }
});

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
////////////////////////        LOGIN         ///////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
interface UserSessionType {
    firstname: string;
    lastname: string;
    pseudo: string;
    email: string;
    sessionToken: string;
    refreshToken: string;
}

api.post('/register/login', (req: Request, res: Response) => {
    let { username, password } = req.body as { username: string, password: string };
    let action = req.query.action as string;

    // Check if the action is valid
    if (!action || action !== 'login') {
        getJsonResponse(res, 400, 'invalid_action', notificationMessages, false);
        return;
    }

    // Check if username and password exist
    if (!username || !password) {
        getJsonResponse(res, 400, 'login_missing', notificationMessages, false);
        return;
    }

    // Cleaning the data to prevent XSS attacks
    username = validator.blacklist(username, '\\<\\>\\{\\}\\[\\]\\`\\#');
    username = validator.escape(username);
    password = validator.escape(password);


    //  Get a database connection from the pool
    dbconnect.getConnection((error: Error, connection: PoolConnection) => {
        // Check if we can connect to the database
        if (error) {
            getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
            return;
        }

        // Check if we reached the maximum of connection allowed
        if (isMaxConnectionReached(dbconnect)) {
            getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
            connection.release();
            return;
        }

        //  If not then prepare and execute the SQL query
        const sql: string = 'SELECT * FROM users WHERE username = ?';

        // execute the query
        connection.query(sql, [username], (error: Error | null, results: Object) => {

            // If there is a database request error
            if (error) {
                getJsonResponse(res, 500, 'request_error', notificationMessages, false);
                connection.release();
                return;
            }

            // Convert the results object to an array
            const queryResult = (results as Array<any>)

            // If the username IS NOT in the database
            if (!queryResult.length || queryResult.length === 0) {
                getJsonResponse(res, 401, 'login_failure', notificationMessages, false);
                connection.release();
                return;
            }
            // If the username IS in the database
            // Check password from form  with password from database 
            const storedPassword: string = queryResult[0].hashpassword;

            bcrypt.compare(password, storedPassword, (error: Error | null, isMatch: boolean) => {

                if (error || !isMatch) {
                    // If there is a problem with the password verification (undefined ? null? problem with bcrypt library ?)                    
                    getJsonResponse(res, 401, error ? 'password_verification_failed' : 'password_failure', notificationMessages, false);
                    connection.release();
                    return;
                }

                // If the password is correct  checking id the account is active or not
                if (queryResult[0].isActivated === 0) {
                    getJsonResponse(res, 401, 'account_not_active', notificationMessages, false);
                    connection.release();
                    return;
                }

                // Get the secret key from the CsrfToken class
                const csrfTokenKeys: CsrfTokenType = CsrfToken.getCsrfTokenKeys();
                const secretKey: string | undefined = csrfTokenKeys.secretKey;
                const refreshKey: string | undefined = csrfTokenKeys.refreshKey;
                const tokenTime: string | undefined = csrfTokenKeys.tokenTime;

                // Generate a token with user information and the secret key
                const sessionToken = jwt.sign(
                    {
                        id_user: queryResult[0].id_users,
                        firstname: queryResult[0].firstname,
                        lastname: queryResult[0].lastname,
                        username: queryResult[0].username,
                        email: queryResult[0].email
                    },
                    secretKey,
                    { expiresIn: tokenTime });

                // Generate a refreshtoken
                const refreshToken = jwt.sign(
                    {
                        id_user: queryResult[0].id_users,
                        firstname: queryResult[0].firstname,
                        lastname: queryResult[0].lastname,
                        username: queryResult[0].username,
                        email: queryResult[0].email
                    },
                    refreshKey,
                    { expiresIn: '2h' });


                // Add the token to the user information
                let userSession: UserSessionType = {
                    firstname: "",
                    lastname: "",
                    pseudo: "",
                    email: "",
                    sessionToken: "",
                    refreshToken: ""
                };

                userSession.firstname = queryResult[0].firstname;
                userSession.lastname = queryResult[0].lastname;
                userSession.pseudo = queryResult[0].username;
                userSession.email = queryResult[0].email;
                userSession.sessionToken = sessionToken;
                userSession.refreshToken = refreshToken;



                // Send the response to the client with the token inside results
                // getJsonResponse(res, 200, 'login_success', notificationMessages, false);
                res.status(200).json({
                    messageKey: 'login_success',
                    state: true,
                    sessionToken: userSession,
                });
                connection.release();

            });
        });
    });
});


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////        ID ADMIN         ///////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
api.get('/isadmin', authToken, (req: any, res: Response) => {


    // Get the id user from the token
    const id_users: number = req.results.id_user;

    dbconnect.getConnection((error: Error, connection: PoolConnection) => {
        if (error) {
            getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
            return;
        }

        // Check if we reached the maximum of connection allowed
        if (isMaxConnectionReached(dbconnect)) {
            getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
            connection.release();
            return;
        }



        //  If not then prepare and execute the SQL query
        const sql: string = 'SELECT id_role FROM users WHERE id_users = ?';

        // execute the query
        connection.query(sql, [id_users], (error: Error | null, results: Object | undefined) => {

            // if there is a database request error
            if (error) {
                getJsonResponse(res, 500, 'request_error', notificationMessages, false);
                connection.release();
                return;
            }

            // Convert the results object to an array
            const queryResult = (results as Array<any>)

            // If the username IS NOT in the database
            if (!queryResult.length || queryResult.length === 0) {
                getJsonResponse(res, 401, 'login_failure', notificationMessages, false);
                connection.release();
                return;
            }
            // If the username IS in the database
            // Check password from form  with password from database 
            const id_role: number = queryResult[0].id_role;

            if (id_role !== 1) {
                getJsonResponse(res, 200, 'user', notificationMessages, false);
                connection.release();
                return;
            }
            connection.release();

            getJsonResponse(res, 200, 'is_admin', notificationMessages, true);
        });
    });
});

export default api;