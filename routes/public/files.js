"use strict";
/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express importation & definition
const express_1 = __importDefault(require("express"));
const api = (0, express_1.default)();
/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////
// CORS middleware
const cors = require('cors');
const CorsConfig_1 = __importDefault(require("../../middlewares/CorsConfig"));
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
// importation of notifications messages
const notifications_1 = require("../../datas/notifications");
const notifications_2 = require("../../functions/notifications");
//////////////////////////////////
////////   LAST FILES   //////////
//////////////////////////////////
api.get('/file/get-files/:id', (req, res) => {
    // get the id from the slug
    let id_disk_units = req.params.id;
    id_disk_units = parseInt(id_disk_units);
    // check if the id is not empty
    if (!id_disk_units || id_disk_units === undefined || id_disk_units === null) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Create the connection to the database
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
        // Prepare the sql query
        const sql = `
        SELECT disk_units.label, files.id_files, files.name
        FROM files 
        JOIN to_contain ON files.id_files = to_contain.id_files 
        JOIN disk_units ON to_contain.id_disk_units = disk_units.id_disk_units      
        WHERE to_contain.id_disk_units = ? AND files.isDisplay = true;`;
        // Execute the query
        connection.query(sql, [id_disk_units], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
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
exports.default = api;
