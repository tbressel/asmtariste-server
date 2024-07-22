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
const util_1 = require("util");
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
//multer (to record files on the server)
const multer_1 = __importDefault(require("multer"));
// multer configuration
const storage = multer_1.default.diskStorage({
    destination: 'downloads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// importation of notifications messages
const notifications_1 = require("../../datas/notifications");
const notifications_2 = require("../../functions/notifications");
//////////////////////////////////
////////   ALL  FILES   //////////
//////////////////////////////////
api.get('/file/all-files/', (req, res) => {
    // Get a connexion to the database
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
        // Prepare the query
        const sql = `SELECT disk_units.letter, disk_units.label, files.id_files, 
        disk_units.id_disk_units, files.name, files.isDisplay
        FROM files         
        JOIN to_contain ON files.id_files = to_contain.id_files 
        JOIN disk_units ON to_contain.id_disk_units = disk_units.id_disk_units
        ORDER BY disk_units.letter ASC`;
        // Execute the query
        connection.query(sql, (error, results) => {
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
api.patch('/file/is-displayed/:id', (req, res) => {
    // get the id in the slug
    let id = req.params.id;
    id = parseInt(id);
    // Check if the id exist
    if (!id) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Get a connection to the database
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
        // Prepare the 1st query up of down depending on the action
        const sql = 'SELECT isDisplay FROM files WHERE id_files = ?';
        // Execute the 1st query
        connection.query(sql, [id], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
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
                const sql2 = 'UPDATE files SET isDisplay = ? WHERE id_files = ?;';
                // Check the result of the query
                const queryResult = results !== undefined && results.length > 0 ? !results[0].isDisplay : false;
                // Execute the 2nd query
                connection.query(sql2, [queryResult, id], (error, results) => {
                    if (error) {
                        (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
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
api.delete('/file/delete/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // check if the id is not empty
    if (!id || id === undefined || id === null) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Establish a connection to the database
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
        // Start a transaction to execute or rollback the both queries
        connection.beginTransaction((error) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "transaction-start-failed", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Convertir connection.query en une fonction qui renvoie une promesse
            const query = (0, util_1.promisify)(connection.query).bind(connection);
            try {
                // prepare the first query
                const sql = "DELETE FROM to_contain WHERE id_files = ?";
                // Execute the 1st query
                const resultsQuery1 = yield query(sql, [id]);
                // prepare the third query
                const sql3 = "DELETE FROM files WHERE id_files = ?";
                // Execute the 3rd query
                const resultsQuery3 = yield query(sql3, [id]);
                // If all queries succeeded, commit the transaction
                connection.commit((err) => {
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
            }
            catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    (0, notifications_2.getJsonResponse)(res, 500, "certificate-failure", notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                });
            }
            finally {
                // Release the connection
                connection.release();
            }
        }));
    });
});
////////////////////////////////////
//////////   ADD FILE   ////////////
////////////////////////////////////
api.post('/file/add', upload.single('file'), (req, res) => {
    // Define default values
    let fileName = "";
    let id_disk_units = 0;
    let isDisplay = false;
    // check if the file exists
    if (!req.file) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // get the name of the file
    if (req.file) {
        fileName = req.file.filename;
    }
    // get the disk unit id
    id_disk_units = req.body.id_disk_units;
    // create de connexion to the database
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
        // Convert connection.query into a function that returns a promise 
        const query = (0, util_1.promisify)(connection.query).bind(connection);
        // Start a transaction to execute or rollback the both queries
        connection.beginTransaction((error) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "transaction-start-failed", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            try {
                // Prepare the first query
                const sql = "INSERT INTO files (name, isDisplay) VALUES (?, ?)";
                // Execute the 1st query
                const results = yield query(sql, [fileName, isDisplay]);
                // Prepare the second query
                const sql2 = "INSERT INTO to_contain (id_disk_units, id_files) VALUES (?, ?)";
                // Execute the 2nd query for each tag
                const results2 = yield query(sql2, [id_disk_units, results.insertId]);
                // If all queries succeeded, commit the transaction
                connection.commit((err) => {
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
            }
            catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    (0, notifications_2.getJsonResponse)(res, 500, "certificate-failure", notifications_1.notificationMessages, false);
                    return;
                });
            }
            finally {
                // Release the connection
                connection.release();
            }
        }));
    });
});
exports.default = api;
