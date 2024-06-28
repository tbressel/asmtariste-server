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

/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////


// Mysql library importation and pool connexion creation
import DatabaseConfig from "../../classes/DatabaseConfig";
import mysql, { PoolConnection } from 'mysql';
import { isMaxConnectionReached } from '../../functions/pool';
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());

// importation of notifications messages
import { notificationMessages } from "../../datas/notifications";
import { getJsonResponse } from "../../functions/notifications";


//////////////////////////////
//////////   GET   ///////////
//////////////////////////////
api.get('/navigation/get-disk-units', (req: Request, res: Response) => {

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


        // Prepare the SQL query
        const sql: string = 'SELECT id_disk_units, label, letter FROM disk_units ORDER BY letter';

        // Execute the query
        connection.query(sql, (error: Error, results: Object | undefined) => {
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

/////////////////////////////////
//////////   DELETE   ///////////
/////////////////////////////////
api.delete('/navigation/delete-disk-unit/:id', (req: Request, res: Response) => {

    // get the id in the slug
    let id: string | number = req.params.id;
    id = parseInt(id);


    // Check if the id exist
    if (!id) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


    // get a connection to the database
    dbconnect.getConnection((error: Error, connection: Object | any) => {
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

                // Prepare the 1st SQL query
                const sql1: string = 'DELETE FROM to_contain WHERE id_disk_units = ?;';

                // Execute the  1st query
                const resultsQuery1 = await query(sql1, [id]);

                // Prepare the 2nd SQL query
                const sql2: string = 'DELETE FROM disk_units WHERE id_disk_units = ?';

                // Execute the 2nd query
                const resultsQuery2 = await query(sql2, [id]);

                // If all queries succeeded, commit the transaction
                connection.commit((err: Error) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }
                });

                // Send the response to the client
                res.status(200).json({
                    query1: resultsQuery1,
                    query2: resultsQuery2,
                    message: "Disk Unit supprimé"
                });

            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "delete-failure", notificationMessages, false);
                    connection.release();
                    return;
                });
            } finally {
                connection.release();
            }
        });
    });
});



/////////////////////////////////
//////////   CREATE   ///////////
/////////////////////////////////

api.post('/navigation/add-disk-unit', (req: Request, res: Response) => {

    // read the data from the POST request
    let { label, letter } = req.body as { label: string, letter: string };
    letter = letter.toUpperCase();

    // Check if the data are correct and exists
    if (!label || !letter) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Define the default values
    let isDisplay: boolean = true;
    let icon: string | null = null;



    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: Object | any) => {
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

        //  Prepare and execute the SQL query
        const sql = `INSERT INTO disk_units (label, letter, icon, isDisplay) VALUES (?, ?,?,?)`;

        // Execute the query
        connection.query(sql, [label, letter, icon, isDisplay], (error: Error, results: Object | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }
            // Release the connection
            connection.release();

            // Send the response
            res.status(200).json({
                body: results
            });
        });
    });

});

export default api;