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
/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////
// Mysql library importation and pool connexion creation
const DatabaseConfig_1 = __importDefault(require("../../classes/DatabaseConfig"));
const mysql_1 = __importDefault(require("mysql"));
const pool_1 = require("../../functions/pool");
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
// importation of the QueryBuild class
const QueryBuild_1 = __importDefault(require("../../classes/QueryBuild"));
// importation of notifications messages
const notifications_1 = require("../../datas/notifications");
const notifications_2 = require("../../functions/notifications");
const token_1 = require("../../functions/token");
//////////////////////////////
//////////   GET   ///////////
//////////////////////////////
api.get('/navigation/get-menu-items', (req, res) => {
    // Get Connexion to the database
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
        // Prepare the SQL query
        const sql = 'SELECT * FROM menu ORDER BY place ASC';
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
/////////////////////////////////
//////////   DELETE   ///////////
/////////////////////////////////
api.delete('/navigation/delete-menu-item/:id', token_1.authToken, (req, res) => {
    // get the id in the slug
    let id = req.params.id;
    const idNumber = parseInt(id);
    // Check if the id exists
    if (!idNumber || idNumber === undefined || idNumber === null) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    //  Get a connexion to the database
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
        // Prepare the SQL query
        const sql = 'DELETE FROM menu WHERE id_menu = ?';
        // Execute the query
        connection.query(sql, [idNumber], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            connection.release();
            res.status(200).json({
                message: "l'élément à été supprimé avec succès",
                body: results
            });
        });
    });
});
//////////////////////////////////
//////////   UPDATE    ///////////
//////////////////////////////////
// api.put('/navigation/update-menu-item/:id', authToken, (req: Request, res: Response) => {
//     // read the new datas from the POST request
//     let { newName } = req.body as { newName: string };
//     // transform the new name in lowercase
//     newName = newName.toLowerCase();
//     // create the new link
//     let newLink: string = "/" + newName;
//     newLink = newLink.replace(" ", "-");
//     // get the id in the slug
//     let id: string | number = req.params.id;
//     id = parseInt(id);
//     // Check if the id exists
//     if (!id) {
//         getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
//         return;
//     }
//     // Establish a connection to the database
//     dbconnect.getConnection((error: Error, connection: Object | any) => {
//         // Check if we can connect to the database
//         if (error) {
//             getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
//             return;
//         }
//         // Check if we reached the maximum of connection allowed
//         if (isMaxConnectionReached(dbconnect)) {
//             getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
//             connection.release();
//             return;
//         }
//         // Prepare the SQL query to get the actual name
//         const actualSql = `SELECT * FROM menu WHERE id_menu = ?`;
//         // Execute the query
//         connection.query(actualSql, [id], (error: Error, actualResults: Object | undefined) => {
//             if (error) {
//                 getJsonResponse(res, 500, "request-failure", notificationMessages, false);
//                 connection.release();
//                 return;
//             }
//             // catch the actual name in a new variable   
//             let actualName: string = (actualResults as { name: string }[])[0].name;
//             if (actualName.toLowerCase() === newName.toLowerCase()) {
//                 // Release the connection
//                 connection.release();
//                 // And send the response
//                 res.status(200).json({
//                     message: "le nouveau nom est le même que l'ancien",
//                     body: actualResults
//                 });
//                 return;
//             } else {
//                 //  Prepare another query
//                 const sql = `UPDATE menu SET name = ?, link = ? WHERE id_menu = ?`;
//                 // Execute the query
//                 connection.query(sql, [newName, newLink, id], (error: Error, newResults: Object | undefined) => {
//                     if (error) {
//                         getJsonResponse(res, 500, "request-failure", notificationMessages, false);
//                         connection.release();
//                         return;
//                     }
//                     // Release the connection
//                     connection.release();
//                     // And send the response
//                     res.status(200).json({
//                         Message: "le nouveau nom à été modifié avec succès",
//                         body: newResults
//                     });
//                 });
//             }
//         });
//     });
// });
///////////////////////////////////
//////////     MOVE     ///////////
///////////////////////////////////
api.patch('/navigation/move-menu-item/:id', token_1.authToken, (req, res) => {
    // get the action from the query
    const action = req.query.action;
    // Check if the action is valid
    if (!action || action !== 'up' && action !== 'down') {
        (0, notifications_2.getJsonResponse)(res, 500, "invalid_action", notifications_1.notificationMessages, false);
        return;
    }
    // get the id in the slug
    let id = req.params.id;
    id = parseInt(id);
    // Check if the id exists
    if (!id || id === undefined || id === null) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Establish a connection to the database
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
                // Prepare the 1st query up of down depending on the action
                const sql = new QueryBuild_1.default().getUpDownQuery(action).queryUpDown;
                // Execute the 1st query
                const results = yield query(sql, [id]);
                // Check if the result contains 2 elements (to invert their places) :
                // if we get 1 element (it's the first or last element) or 0 element (there is a problem)
                if (results && Object.keys(results).length < 2) {
                    // 1 result means that it's the last element
                    res.status(500).json({
                        message: "cet élement ne peut pas etre déplacé",
                        body: results
                    });
                    return;
                }
                // get the places and ids of the 2 elements
                let elements = results.map(({ place, id_menu }) => ({ place, id_menu }));
                // invert the places
                [elements[0].place, elements[1].place] = [elements[1].place, elements[0].place];
                // For each element, update the place
                elements.forEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ place, id_menu }) {
                    // Prepare the next query
                    const sql = new QueryBuild_1.default().getUpDownQuery(action).queryUpdate;
                    // Execute the query
                    const results = yield query(sql, [place, id_menu]);
                }));
                // If all queries succeeded, commit the transaction
                connection.commit((error) => {
                    if (error) {
                        return connection.rollback(() => {
                            throw error;
                        });
                    }
                });
                res.status(200).json({
                    message: "l'élément à été déplacé avec succès",
                    body: results
                });
            }
            catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    (0, notifications_2.getJsonResponse)(res, 500, "move-failure", notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                });
            }
            finally {
                connection.release();
            }
        }));
    });
});
/////////////////////////////////
//////////   CREATE   ///////////
/////////////////////////////////
api.post('/navigation/add-menu-item', token_1.authToken, (req, res) => {
    // read the data from the POST request
    let { name } = req.body;
    name = name.toLowerCase();
    // Check if name exists
    if (!name) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Define default values
    let link = "/" + name.toLowerCase();
    link = link.replace(" ", "-");
    let place = 0;
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
        // GET THE MAX PLACE NUMBER TO CALC THE NEW ONE 
        //  Prepare and execute the SQL query
        const sqlMaxPlace = `SELECT MAX(place) as 'maxPlace' FROM menu;`;
        // Execute the query
        connection.query(sqlMaxPlace, (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Check if we don't get any result
            if (results && Object.keys(results).length !== 1 || results === undefined) {
                // if we have only one result
                res.status(500).json({
                    messge: "Problème avec le nombre de réponse",
                    body: results
                });
                // Release the connection
                connection.release();
                return;
            }
            let newplace = parseInt(results[0].maxPlace) + 1;
            // CHECK NEW ENTRY ALREADY EXISTS
            //  Prepare and execute the SQL query
            const sql = `SELECT name FROM menu WHERE name = ?`;
            // Execute the query
            connection.query(sql, [name], (error, results) => {
                if (error) {
                    (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                }
                // Check if the result is not empty and if results are upper than 0
                if (results && Object.keys(results).length > 0) {
                    // results is not empty, it means that the name already exists
                    res.status(200).json({
                        body: results
                    });
                    // Release the connection
                    connection.release();
                    return;
                }
                // INSERT NEW ENTRY INTO DATABASE
                //  Prepare another query
                const sql = `INSERT INTO menu (name, link, place) VALUES (?, ?, ?)`;
                // Execute the query
                connection.query(sql, [name, link, newplace], (error, results) => {
                    if (error) {
                        (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
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
    });
});
/////////////////////////////////////////
//////////   GET ADMIN MENU   ///////////
/////////////////////////////////////////
api.get('/navigation/get-admin-menu-items', (req, res) => {
    // Get Connexion to the database
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
        // Prepare the SQL query
        const sql = 'SELECT * FROM menu_admin';
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
exports.default = api;
