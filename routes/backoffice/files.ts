/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response } from "express";
const api: Express = express();

import { promisify } from 'util';
/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////

// CORS middleware
const cors = require('cors');
import CorsConfig from "../../middlewares/CorsConfig";
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



//multer (to record files on the server)
import multer from 'multer';
import path from 'path';

// multer configuration
const storage = multer.diskStorage({
    destination: 'downloads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// importation of notifications messages
import { notificationMessages } from "../../datas/notifications";
import { getJsonResponse } from "../../functions/notifications";


//////////////////////////////////
////////   ALL  FILES   //////////
//////////////////////////////////
api.get('/file/all-files/', (req: Request, res: Response) => {

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

        // Prepare the query
        const sql: string = `SELECT disk_units.letter, disk_units.label, files.id_files, 
        disk_units.id_disk_units, files.name, files.isDisplay
        FROM files         
        JOIN to_contain ON files.id_files = to_contain.id_files 
        JOIN disk_units ON to_contain.id_disk_units = disk_units.id_disk_units
        ORDER BY disk_units.letter ASC`;

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
//////////     DISPLAY OR HIDE FILES        ///////////
///////////////////////////////////////////////////////

interface isDisplayedFile {
    isDisplay: boolean;
}

api.patch('/file/is-displayed/:id', (req: Request, res: Response) => {

    // get the id in the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // Check if the id exist
    if (!id) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


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

        // Prepare the 1st query up of down depending on the action
        const sql: string = 'SELECT isDisplay FROM files WHERE id_files = ?';

        // Execute the 1st query
        connection.query(sql, [id], (error: Error, results: isDisplayedFile[] | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }

            // Check if the result contains 2 elements (to invert their places) :
            // if we get 1 element (it's the first or last element) or 0 element (there is a problem)
            if (!results || Object.keys(results).length === 0) {
                // 1 result means that it's the last element
                res.status(404).json({
                    message: "cet élement n'existe pas",
                    body: results
                });
                // Release the connection
                connection.release();
                return;
            }

            if (results && Object.keys(results).length > 0) {

                // Prepare the 1st query up of down depending on the action
                const sql2: string = 'UPDATE files SET isDisplay = ? WHERE id_files = ?;';

                // Check the result of the query
                const queryResult: boolean = results !== undefined && results.length > 0 ? !results[0].isDisplay : false;

                // Execute the 2nd query
                connection.query(sql2, [queryResult, id], (error: Error, results: Object | undefined) => {
                    if (error) {
                        getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                        connection.release();
                        return;
                    }

                    res.status(200).json({
                        message: "parfait",
                        body: results
                    });
        
                    // Release the connection
                    connection.release();
                    return;
                });
            }
        });
    });
});


////////////////////////////////////////////
////////    DELETE THE FILES   ///////////
////////////////////////////////////////////
api.delete('/file/delete/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // check if the id is not empty
    if (!id || id === undefined || id === null) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


    // Establish a connection to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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


            // Convertir connection.query en une fonction qui renvoie une promesse
            const query = promisify(connection.query).bind(connection);

            try {

                // prepare the first query
                const sql: string = "DELETE FROM to_contain WHERE id_files = ?";
                // Execute the 1st query
                const resultsQuery1 = await query(sql, [id]);

                // prepare the third query
                const sql3: string = "DELETE FROM files WHERE id_files = ?";
                // Execute the 3rd query
                const resultsQuery3 = await query(sql3, [id]);


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
                    query3: resultsQuery3,
                    message: "Fichier supprimé"
                });

            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "certificate-failure", notificationMessages, false);
                    connection.release();
                    return;
                });
            } finally {
                // Release the connection
                connection.release();
            }
        });
    });

});

////////////////////////////////////
//////////   ADD FILE   ////////////
////////////////////////////////////

api.post('/file/add', upload.single('file'), (req: Request, res: Response) => {

    // Define default values
    let fileName: string = "";
    let id_disk_units: number = 0;
    let isDisplay: boolean = false;

    // check if the file exists
    if (!req.file) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


    // get the name of the file
    if (req.file) {
        fileName = req.file.filename;
    }

    // get the disk unit id
    id_disk_units = req.body.id_disk_units;

    // create de connexion to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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


            // Convert connection.query into a function that returns a promise 
            const query = promisify(connection.query).bind(connection);


        // Start a transaction to execute or rollback the both queries
        connection.beginTransaction(async (error: Error) => {
            if (error) {
                getJsonResponse(res, 500, "transaction-start-failed", notificationMessages, false);
                connection.release();
                return;
            }


            try {
                // Prepare the first query
                const sql: string = "INSERT INTO files (name, isDisplay) VALUES (?, ?)";

                // Execute the 1st query
                const results = await query(sql, [fileName, isDisplay]);

                // Prepare the second query
                const sql2: string = "INSERT INTO to_contain (id_disk_units, id_files) VALUES (?, ?)";

                // Execute the 2nd query for each tag
                const results2 = await query(sql2, [id_disk_units, results.insertId]);


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
                    fileName: fileName,
                    message: "fichier ajouté"
                });
            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "certificate-failure", notificationMessages, false);
                    return;
                });
            } finally {
                // Release the connection
                connection.release();
            }
        });
    });
});

export default api;