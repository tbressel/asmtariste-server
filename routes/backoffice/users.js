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
// Import promisify to convert connection.query into a function that returns a promise
const util_1 = require("util");
/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////
// CORS middleware
const CorsConfig_1 = __importDefault(require("../../middlewares/CorsConfig"));
const corsOptions = CorsConfig_1.default.getCorsConfig();
const cors = require('cors');
api.use(cors(corsOptions));
// Body Parser Middleware to check data body from http request & configuration
const body_parser_1 = require("../../middlewares/body-parser");
api.use(body_parser_1.urlEncodedParserMiddleware);
api.use(body_parser_1.jsonParserMiddleware);
//multer (to record files on the server)
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// multer configuration
const storage = multer_1.default.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////
// Mysql library importation and pool connexion creation
const DatabaseConfig_1 = __importDefault(require("../../classes/DatabaseConfig"));
const mysql_1 = __importDefault(require("mysql"));
const pool_1 = require("../../functions/pool");
const token_1 = require("../../functions/token");
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
// importation of notifications messages
const notifications_1 = require("../../datas/notifications");
const notifications_2 = require("../../functions/notifications");
/////////////////////////////////////
////////    ALL USERS   //////////
/////////////////////////////////////
api.get('/users-list', token_1.authToken, (req, res) => {
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
        // prepare the query
        const sql = `SELECT id_users, username, email, isActivated, r.name, registrationDate 
        FROM users
        JOIN role r 
        USING (id_role);`;
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
api.patch('/users/is-activated/:id', token_1.authToken, (req, res) => {
    // get the id in the slug
    let id = req.params.id;
    // Convert the id into a number
    id = parseInt(id);
    // Check if id exists
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
        const sql = 'SELECT isActivated FROM users WHERE id_users = ?';
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
                (0, notifications_2.getJsonResponse)(res, 500, "missing-results", notifications_1.notificationMessages, false);
                // Release the connection
                connection.release();
                return;
            }
            // Check if results contains elements
            if (results && Object.keys(results).length > 0) {
                // Prepare the 1st query up of down depending on the action
                const sql2 = 'UPDATE users SET isActivated = ? WHERE id_users = ?;';
                // Invert the boolean value
                const queryResult = results !== undefined && results.length > 0 ? !results[0].isActivated : false;
                // Execute the 2nd query
                connection.query(sql2, [queryResult, id], (error, results) => {
                    if (error) {
                        (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
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
api.delete('/users/delete/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // Check if id exists
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
            // Convert connection.query into a function that returns a promise 
            const query = (0, util_1.promisify)(connection.query).bind(connection);
            try {
                // prepare the zero query
                const sql0 = "SELECT id_certificates FROM to_graduate WHERE id_users = ?";
                // Execute the 0 query
                const resultIdCertifOfIdUsers = yield query(sql0, [id]);
                // prepare the zero query
                const sql1 = "DELETE FROM to_graduate WHERE id_users = ?";
                // Execute the 0 query
                const resultsQuery0 = yield query(sql1, [id]);
                // Loop on each results to delete certificates
                for (const row of resultIdCertifOfIdUsers) {
                    // prepare the query  for each certificate
                    const sql2 = "DELETE FROM certificates WHERE id_certificates = ?";
                    // Execute the query for each certificate
                    yield query(sql2, [row.id_certificates]);
                }
                // prepare the next query
                const sql3 = `UPDATE users SET email = NULL, hashpassword = NULL, username = NULL, firstname = NULL,
                                        lastname = NULL, isActivated = FALSE, id_role = 0 
                                        WHERE id_users = ?;`;
                // Execute the query
                const resultsQuery1 = yield query(sql3, [id]);
                // If all queries succeeded, commit the transaction
                connection.commit((error) => {
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
            }
            catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    (0, notifications_2.getJsonResponse)(res, 500, "delete-failure", notifications_1.notificationMessages, false);
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
