"use strict";
/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express importation & definition
const express_1 = __importDefault(require("express"));
const api = (0, express_1.default)();
// Dotenv library used for environment variables
const dotenv = require('dotenv');
dotenv.config();
const token_1 = require("../../functions/token");
/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////
// CORS middleware
const CorsConfig_1 = __importDefault(require("../../middlewares/CorsConfig"));
const cors = require('cors');
const corsOptions = CorsConfig_1.default.getCorsConfig();
api.use(cors(corsOptions));
// Body Parser Middleware to check data body from http request & configuration
const body_parser_1 = require("../../middlewares/body-parser");
api.use(body_parser_1.urlEncodedParserMiddleware);
api.use(body_parser_1.jsonParserMiddleware);
/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////
// Mysql library importation and pool connexion creation
const DatabaseConfig_1 = __importDefault(require("../../classes/DatabaseConfig"));
const mysql_1 = __importDefault(require("mysql"));
const pool_1 = require("../../functions/pool");
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
// Validator library importation to check and clean datas from request
const validator_1 = __importDefault(require("validator"));
// Bcrypt library used to hash passwords
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Jsonwebtoken to generate a token
const jwt = require('jsonwebtoken');
const CsrfToken_1 = require("../../classes/CsrfToken");
// importation of notifications messages
const notifications_1 = require("../../datas/notifications");
const notifications_2 = require("../../functions/notifications");
const activation_email_1 = require("../../functions/activation-email");
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////     SIGNIN      //////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
api.post('/register/signin', (req, res) => {
    // read the data from the POST request
    let { username, email, password } = req.body;
    let action = req.query.action;
    // Check if the action is valid
    if (!action || action !== 'signin') {
        (0, notifications_2.getJsonResponse)(res, 400, 'invalid_action', notifications_1.notificationMessages, false);
        return;
    }
    // CHeck if the data is missing
    if (!username || !email || !password) {
        (0, notifications_2.getJsonResponse)(res, 400, 'missing-datas', notifications_1.notificationMessages, false);
        return;
    }
    // Cleaning the data to prevent XSS attacks
    username = validator_1.default.escape(username);
    email = validator_1.default.escape(email);
    password = validator_1.default.escape(password);
    // define default values
    let id_role = 2;
    let isActivated = false;
    let registrationDate = new Date();
    const firstname = "null";
    const lastname = "null";
    // check if the email is valid with the validator method
    if (!validator_1.default.isEmail(email)) {
        (0, notifications_2.getJsonResponse)(res, 401, 'email_bad_format', notifications_1.notificationMessages, false);
        return;
    }
    // repeat salt process during 10 rounds
    const saltRounds = 10;
    // password = null;
    // hash the password with salt
    bcryptjs_1.default.hash(password, saltRounds, function (error, hash) {
        if (error) {
            // If there is a problem with the password verification (undefined ? null? problem with bcrypt library ?)
            (0, notifications_2.getJsonResponse)(res, 401, 'password_verification_failed', notifications_1.notificationMessages, false);
            return;
        }
        else {
            const hashpassword = hash;
            //  Get a database connection from the pool
            dbconnect.getConnection((error, connection) => {
                // Check if we can connect to the database
                if (error) {
                    (0, notifications_2.getJsonResponse)(res, 500, "dbconnect-error", notifications_1.notificationMessages, false);
                    return;
                }
                // Check if we reached the maximum of connection allowed
                if ((0, pool_1.isMaxConnectionReached)(dbconnect)) {
                    (0, notifications_2.getJsonResponse)(res, 500, "maxconnect-reached", notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                }
                // If not then prepare and execute the SQL query to check if this user already exists
                const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
                // execute the query
                dbconnect.query(checkSql, [username, email], (error, results) => {
                    // if there is a database request error
                    if (error) {
                        (0, notifications_2.getJsonResponse)(res, 500, 'request_error', notifications_1.notificationMessages, false);
                        connection.release();
                        return;
                    }
                    // Convert the results object to an array
                    const queryResult = results.length;
                    if (queryResult > 0) {
                        // if the user already exists
                        (0, notifications_2.getJsonResponse)(res, 401, 'exist_data', notifications_1.notificationMessages, false);
                        connection.release();
                        return;
                    }
                    // Get the secret key from the CsrfToken class
                    const csrfTokenKeys = CsrfToken_1.CsrfToken.getCsrfTokenKeys();
                    const secretKey = csrfTokenKeys.secretKey;
                    // Generate a token with user information and the secret key
                    const sessionToken = jwt.sign({
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                        email: email,
                    }, secretKey, { expiresIn: '72h' });
                    // Prepare parameters for the activation email
                    const activationEmail = email;
                    const activationLink = 'https://asmtariste.thomas-bressel.com/activation?action=activate&token=' + sessionToken;
                    (0, activation_email_1.sendActivationEmail)(activationEmail, activationLink)
                        .then(() => {
                        //  If not then prepare and execute the SQL query
                        const sql = `INSERT INTO users (firstname, lastname, username, email, hashpassword, isActivated, id_role, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                        // execute the query
                        dbconnect.query(sql, [firstname, lastname, username, email, hashpassword, isActivated, id_role, registrationDate], (error) => {
                            if (error) {
                                (0, notifications_2.getJsonResponse)(res, 500, 'request_error', notifications_1.notificationMessages, false);
                                connection.release();
                                return;
                            }
                        });
                    })
                        .then(() => {
                        (0, notifications_2.getJsonResponse)(res, 200, 'signin_success', notifications_1.notificationMessages, true);
                        connection.release();
                    })
                        .catch((error) => {
                        (0, notifications_2.getJsonResponse)(res, 500, 'email_failure', notifications_1.notificationMessages, false);
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
api.get('/activation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, token } = req.query;
    // Check if the action is valid
    if (!action || action !== 'activate') {
        (0, notifications_2.getJsonResponse)(res, 400, 'invalid_action', notifications_1.notificationMessages, false);
        return;
    }
    // Test if the token is missing or null of undefined
    if (!token || token === null || token === undefined) {
        (0, notifications_2.getJsonResponse)(res, 401, 'token_missing', notifications_1.notificationMessages, false);
        return;
    }
    // Get the secret key from the CsrfToken class
    const csrfTokenKeys = CsrfToken_1.CsrfToken.getCsrfTokenKeys();
    const secretKey = csrfTokenKeys.secretKey;
    // Verify the token with the secret key
    try {
        // Utilisation de async/await pour attendre la vérification du token
        const results = yield new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                    // Add the results to the request object with the jwt decoded 
                }
            });
        });
        req.results = results;
        console.log("Les résultats de la requête sont : ", results);
        // create variables to store the nickname and the email
        const username = req.results.username;
        const email = req.results.email;
        //  Get a database connection from the pool
        dbconnect.getConnection((error, connection) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if we can connect to the database
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "dbconnect-error", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Check if we reached the maximum of connection allowed
            if ((0, pool_1.isMaxConnectionReached)(dbconnect)) {
                (0, notifications_2.getJsonResponse)(res, 500, "maxconnect-reached", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // If not then prepare and execute the SQL query to check if this user already exists
            const sql = 'UPDATE users SET isActivated = 1 WHERE username = ? AND email = ?';
            // execute the query
            dbconnect.query(sql, [username, email], (error, results) => {
                // if there is a database request error
                if (error) {
                    (0, notifications_2.getJsonResponse)(res, 500, 'request_error', notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                }
                // If the account is well activated
                // getJsonResponse(res, 200, 'account_activated', notificationMessages, false);
                res.redirect('https://www.asmtariste.fr/');
                connection.release();
            });
        }));
    }
    catch (error) {
        (0, notifications_2.getJsonResponse)(res, 403, 'token_failure', notifications_1.notificationMessages, false);
        return;
    }
}));
api.post('/register/login', (req, res) => {
    let { username, password } = req.body;
    let action = req.query.action;
    // Check if the action is valid
    if (!action || action !== 'login') {
        (0, notifications_2.getJsonResponse)(res, 400, 'invalid_action', notifications_1.notificationMessages, false);
        return;
    }
    // Check if username and password exist
    if (!username || !password) {
        (0, notifications_2.getJsonResponse)(res, 400, 'login_missing', notifications_1.notificationMessages, false);
        return;
    }
    // Cleaning the data to prevent XSS attacks
    username = validator_1.default.blacklist(username, '\\<\\>\\{\\}\\[\\]\\`\\#');
    username = validator_1.default.escape(username);
    password = validator_1.default.escape(password);
    //  Get a database connection from the pool
    dbconnect.getConnection((error, connection) => {
        // Check if we can connect to the database
        if (error) {
            (0, notifications_2.getJsonResponse)(res, 500, "dbconnect-error", notifications_1.notificationMessages, false);
            return;
        }
        // Check if we reached the maximum of connection allowed
        if ((0, pool_1.isMaxConnectionReached)(dbconnect)) {
            (0, notifications_2.getJsonResponse)(res, 500, "maxconnect-reached", notifications_1.notificationMessages, false);
            connection.release();
            return;
        }
        //  If not then prepare and execute the SQL query
        const sql = 'SELECT * FROM users WHERE username = ?';
        // execute the query
        connection.query(sql, [username], (error, results) => {
            // If there is a database request error
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, 'request_error', notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Convert the results object to an array
            const queryResult = results;
            // If the username IS NOT in the database
            if (!queryResult.length || queryResult.length === 0) {
                (0, notifications_2.getJsonResponse)(res, 401, 'login_failure', notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // If the username IS in the database
            // Check password from form  with password from database 
            const storedPassword = queryResult[0].hashpassword;
            bcryptjs_1.default.compare(password, storedPassword, (error, isMatch) => {
                if (error || !isMatch) {
                    // If there is a problem with the password verification (undefined ? null? problem with bcrypt library ?)                    
                    (0, notifications_2.getJsonResponse)(res, 401, error ? 'password_verification_failed' : 'password_failure', notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                }
                // If the password is correct  checking id the account is active or not
                if (queryResult[0].isActivated === 0) {
                    (0, notifications_2.getJsonResponse)(res, 401, 'account_not_active', notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                }
                // Get the secret key from the CsrfToken class
                const csrfTokenKeys = CsrfToken_1.CsrfToken.getCsrfTokenKeys();
                const secretKey = csrfTokenKeys.secretKey;
                const refreshKey = csrfTokenKeys.refreshKey;
                const tokenTime = csrfTokenKeys.tokenTime;
                // Generate a token with user information and the secret key
                const sessionToken = jwt.sign({
                    id_user: queryResult[0].id_users,
                    firstname: queryResult[0].firstname,
                    lastname: queryResult[0].lastname,
                    username: queryResult[0].username,
                    email: queryResult[0].email
                }, secretKey, { expiresIn: tokenTime });
                // Generate a refreshtoken
                const refreshToken = jwt.sign({
                    id_user: queryResult[0].id_users,
                    firstname: queryResult[0].firstname,
                    lastname: queryResult[0].lastname,
                    username: queryResult[0].username,
                    email: queryResult[0].email
                }, refreshKey, { expiresIn: '2h' });
                // Add the token to the user information
                let userSession = {
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
api.get('/isadmin', token_1.authToken, (req, res) => {
    // Get the id user from the token
    const id_users = req.results.id_user;
    dbconnect.getConnection((error, connection) => {
        if (error) {
            (0, notifications_2.getJsonResponse)(res, 500, "dbconnect-error", notifications_1.notificationMessages, false);
            return;
        }
        // Check if we reached the maximum of connection allowed
        if ((0, pool_1.isMaxConnectionReached)(dbconnect)) {
            (0, notifications_2.getJsonResponse)(res, 500, "maxconnect-reached", notifications_1.notificationMessages, false);
            connection.release();
            return;
        }
        //  If not then prepare and execute the SQL query
        const sql = 'SELECT id_role FROM users WHERE id_users = ?';
        // execute the query
        connection.query(sql, [id_users], (error, results) => {
            // if there is a database request error
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, 'request_error', notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Convert the results object to an array
            const queryResult = results;
            // If the username IS NOT in the database
            if (!queryResult.length || queryResult.length === 0) {
                (0, notifications_2.getJsonResponse)(res, 401, 'login_failure', notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // If the username IS in the database
            // Check password from form  with password from database 
            const id_role = queryResult[0].id_role;
            if (id_role !== 1) {
                (0, notifications_2.getJsonResponse)(res, 200, 'user', notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            connection.release();
            (0, notifications_2.getJsonResponse)(res, 200, 'is_admin', notifications_1.notificationMessages, true);
        });
    });
});
exports.default = api;
