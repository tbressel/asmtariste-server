/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response } from "express";
const api: Express = express();

// Import promisify to convert connection.query into a function that returns a promise
import { promisify } from 'util';

/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////

// CORS middleware
import CorsConfig from "../../middlewares/CorsConfig";
const corsOptions = CorsConfig.getCorsConfig();
const cors = require('cors');
api.use(cors(corsOptions));

// Body Parser Middleware to check data body from http request & configuration
import { urlEncodedParserMiddleware, jsonParserMiddleware } from "../../middlewares/body-parser";
api.use(urlEncodedParserMiddleware);
api.use(jsonParserMiddleware);

//multer (to record files on the server)
import multer from 'multer';
import path from 'path';

// multer configuration
const storage = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////

// Mysql library importation and pool connexion creation
import DatabaseConfig from "../../classes/DatabaseConfig";
import mysql, { PoolConnection } from 'mysql';
import { isMaxConnectionReached } from '../../functions/pool';

import { authToken } from "../../functions/token";
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());

// importation of notifications messages
import { notificationMessages } from "../../datas/notifications";
import { getJsonResponse } from "../../functions/notifications";

 


/////////////////////////////////////
////////    ALL USERS   //////////
/////////////////////////////////////
api.get('/users-list', authToken, (req: Request, res: Response) => {

    // Get a connexion to the database
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

        // prepare the query
        const sql: string = `SELECT id_users, username, email, isActivated, r.name, registrationDate 
        FROM users
        JOIN role r 
        USING (id_role);`;

        // Execute the query
        connection.query(sql, (error: Error, results: any) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }

            connection.release();

            res.status(200).json({
                body: results
            });
        });
    });






});


///////////////////////////////////////////////////////
////////////     ACTIVATE OR NOT  USERS     ///////////
///////////////////////////////////////////////////////

interface isActivatedArticle {
    isActivated: boolean;
}

api.patch('/users/is-activated/:id',authToken, (req: Request, res: Response) => {

    // get the id in the slug
    let id: string | number = req.params.id;

    // Convert the id into a number
    id = parseInt(id);

    // Check if id exists
    if (!id) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }
    
    // Get a connection to the database
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

        // Prepare the 1st query up of down depending on the action
        const sql: string = 'SELECT isActivated FROM users WHERE id_users = ?';

        // Execute the 1st query
        connection.query(sql, [id], (error: Error | null, results: isActivatedArticle[] | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }

            // Check if the result contains 2 elements (to invert their places) :
            // if we get 1 element (it's the first or last element) or 0 element (there is a problem)
            if (!results || Object.keys(results).length === 0) {
                getJsonResponse(res, 500, "missing-results", notificationMessages, false);
                // Release the connection
                connection.release();
                return;


            }

            // Check if results contains elements
            if (results && Object.keys(results).length > 0) {

                // Prepare the 1st query up of down depending on the action
                const sql2: string = 'UPDATE users SET isActivated = ? WHERE id_users = ?;';
                
                // Invert the boolean value
                const queryResult: boolean = results !== undefined && results.length > 0 ? !results[0].isActivated : false;

                // Execute the 2nd query
                connection.query(sql2, [queryResult, id], (error: Error | null, results: Object | undefined) => {
                    if (error) {
                        getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                        connection.release();
                        return;
                    }
                });

                res.status(200).json({
                    body: results
                });

                // Release the connection
                connection.release();
                return;
            }
        });
    });
});


////////////////////////////////////////////
///////////    DELETE THE USER   ///////////
////////////////////////////////////////////
api.delete('/users/delete/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // Check if id exists
    if (!id || id === undefined || id === null) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Establish a connection to the database
    dbconnect.getConnection((error: Error | null, connection: any) => {
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

        // Start a transaction to execute or rollback the both queries
        connection.beginTransaction(async (error: Error) => {
            if (error) {
                getJsonResponse(res, 500, "transaction-start-failed", notificationMessages, false);
                connection.release();
                return;
            }

            // Convert connection.query into a function that returns a promise 
            const query = promisify(connection.query).bind(connection);

            try {

                // prepare the zero query
                const sql0: string = "SELECT id_certificates FROM to_graduate WHERE id_users = ?";

                // Execute the 0 query
                const resultIdCertifOfIdUsers = await query(sql0, [id]);

                // prepare the zero query
                const sql1: string = "DELETE FROM to_graduate WHERE id_users = ?";

                // Execute the 0 query
                const resultsQuery0 = await query(sql1, [id]);


                // Loop on each results to delete certificates
                    for (const row of resultIdCertifOfIdUsers) {
                    // prepare the query  for each certificate
                    const sql2 = "DELETE FROM certificates WHERE id_certificates = ?";

                    // Execute the query for each certificate
                    await query(sql2, [row.id_certificates]);
                }
                                

                // prepare the next query
                const sql3: string = `UPDATE users SET email = NULL, hashpassword = NULL, username = NULL, firstname = NULL,
                                        lastname = NULL, isActivated = FALSE, id_role = 0 
                                        WHERE id_users = ?;`;

                // Execute the query
                const resultsQuery1 = await query(sql3, [id]);

               

                // If all queries succeeded, commit the transaction
                connection.commit((error: Error) => {
                    if (error) {
                        return connection.rollback(() => {
                            throw error;
                        });
                    }
                });

                // Send the response to the client
                res.status(200).json({
                    query1: resultsQuery1,
                    message: "Utilisateur ghosté et certificat supprimé avec succès"
                });

            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "delete-failure", notificationMessages, false);

                });
            } finally {
                // Release the connection
                connection.release();
            }
        });
    });
});



export default api;