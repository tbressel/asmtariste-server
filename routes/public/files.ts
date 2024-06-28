/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response } from "express";
const api: Express = express();


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

// importation of notifications messages
import { notificationMessages } from "../../datas/notifications";
import { getJsonResponse } from "../../functions/notifications";

 

//////////////////////////////////
////////   LAST FILES   //////////
//////////////////////////////////
api.get('/file/get-files/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id_disk_units: string | number = req.params.id;
    id_disk_units = parseInt(id_disk_units);

    // check if the id is not empty
    if (!id_disk_units || id_disk_units === undefined || id_disk_units === null) {
            getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Create the connection to the database
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


        // Prepare the sql query
        const sql: string = `
        SELECT disk_units.label, files.id_files, files.name
        FROM files 
        JOIN to_contain ON files.id_files = to_contain.id_files 
        JOIN disk_units ON to_contain.id_disk_units = disk_units.id_disk_units      
        WHERE to_contain.id_disk_units = ? AND files.isDisplay = true;`;

        // Execute the query
        connection.query(sql, [id_disk_units], (error: Error | null, results: Object) => {
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

export default api;