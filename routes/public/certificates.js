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
const token_1 = require("../../functions/token");
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
////////////////////////////////////////
////////   CREATE CERTIFICATE   //////////
///////////////////////////////////////
api.post('/create-certificate/:id', token_1.authToken, (req, res) => {
    // Get values from the request params
    const id_articles = req.params.id;
    // Get values from the request body
    const isCertificate = req.body.certificate;
    const note = req.body.note;
    // check if the values are not empty
    if (!isCertificate || id_articles === undefined) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Get the id user from the token
    const id_users = req.results.id_user;
    const firstname = req.results.firstname;
    const lastname = req.results.lastname;
    const username = req.results.username;
    // Define the date of creation
    const creationDateValue = new Date();
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
        // Prepare the first query to check if the user has already a certificate for this article
        const sqlQuery0 = `SELECT id_certificates FROM to_graduate WHERE id_users = ? AND id_articles = ?`;
        // Execute the first query
        connection.query(sqlQuery0, [id_users, id_articles], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            const queryResult = results.length;
            // If the user has already a certificate for this article
            if (queryResult > 0) {
                (0, notifications_2.getJsonResponse)(res, 500, "certificate-already-exist", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            else {
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
                        // Prepare the 1st SQL query
                        const sqlQuery1 = `SELECT title FROM articles WHERE id_articles = ?`;
                        // Execute the 1st SQL query
                        const queryResult1 = yield query(sqlQuery1, [id_articles]);
                        const title = queryResult1[0].title;
                        // Prepare the 2nd SQL query
                        const sqlQuery2 = `INSERT INTO certificates (creationDate, note) VALUES (?, ?)`;
                        // Execute the 2nd SQL query
                        const queryResult2 = yield query(sqlQuery2, [creationDateValue, note]);
                        // Get this ID where the quesry was created
                        const id_certificates = queryResult2.insertId;
                        // Prepare the 3rd SQL query
                        const sqlQuery3 = `INSERT INTO to_graduate (id_articles, id_users, id_certificates) VALUES (?, ?, ?)`;
                        // Execute the 3rd SQL query
                        const queryResult3 = yield query(sqlQuery3, [id_articles, id_users, id_certificates]);
                        // If all queries succeeded, commit the transaction
                        connection.commit((error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    throw error;
                                });
                            }
                        });
                        res.json({
                            message: 'Certificat créé avec succès',
                            title: title,
                            date: creationDateValue,
                            username: username,
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
                        connection.release();
                    }
                }));
            }
        });
    });
});
////////////////////////////////////////
////////   ALL CERTIFICATES   //////////
///////////////////////////////////////
api.get('/all-certificates/', token_1.authToken, (req, res) => {
    // Get the id user from the token
    const id_users = req.results.id_user;
    // check if the values are not empty
    if (id_users === undefined) {
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
        // Prepare the query to get the certificates
        const sqlQuery = `SELECT certificates.id_certificates, certificates.note, certificates.creationDate, users.username, articles.title
                                    FROM to_graduate
                                    JOIN users USING (id_users)
                                    JOIN articles USING (id_articles)
                                    JOIN certificates USING (id_certificates)`;
        // Execute the query
        connection.query(sqlQuery, [id_users], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            else {
                connection.release();
                // Send the response to the client
                res.status(200).json({
                    body: results
                });
            }
        });
    });
});
////////////////////////////////////////
////////   LAST CERTIFICATES   /////////
///////////////////////////////////////
api.get('/last-certificates/', (req, res) => {
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
        // Prepare the query to get the certificates
        const sqlQuery = `SELECT certificates.note, certificates.creationDate, users.username, articles.title
                                    FROM to_graduate
                                    JOIN users USING (id_users)
                                    JOIN articles USING (id_articles)
                                    JOIN certificates USING (id_certificates)
                                    ORDER BY certificates.creationDate DESC`;
        // Execute the query
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            else {
                const queryResult = results;
                console.log(queryResult);
                let medalType = '';
                let medalColour = '';
                let courseLevel = 1;
                let medalUrl = '';
                for (const item of queryResult) {
                    // Détermination du type de médaille basée sur la note
                    if (item.note <= 15) {
                        medalType = 'bronze';
                    }
                    else if (item.note >= 16 && item.note <= 18) {
                        medalType = 'silver';
                    }
                    else if (item.note >= 19) {
                        medalType = 'gold';
                    }
                    // Détermination de la couleur de la médaille basée sur le niveau du cours
                    switch (courseLevel) {
                        case 1:
                            medalColour = 'green';
                            break;
                        case 2:
                            medalColour = 'yellow';
                            break;
                        case 3:
                            medalColour = 'orange';
                            break;
                        case 4:
                            medalColour = 'cyan';
                            break;
                        case 5:
                            medalColour = 'blue';
                            break;
                        case 6:
                            medalColour = 'red';
                            break;
                        default:
                            medalColour = 'unknown';
                    }
                    // Construction de l'URL de la médaille
                    medalUrl = `${medalType}-${medalColour}.webp`;
                    // Ajout de la clé "medal" avec l'URL de la médaille au résultat
                    item.medal = medalUrl;
                }
                connection.release();
                // Send the response to the client
                res.status(200).json({
                    body: results
                });
            }
        });
    });
});
////////////////////////////////////////
////////   DELETE CERTIFICATE   //////////
///////////////////////////////////////
api.delete('/delete-certificate/:id', token_1.authToken, (req, res) => {
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
                const sql1 = "DELETE FROM to_graduate WHERE id_certificates = ?;";
                // Execute the 0 query
                const resultsQuery1 = yield query(sql1, [id]);
                // prepare the next query
                const sql2 = `DELETE FROM certificates WHERE id_certificates = ?`;
                // Execute the query
                const resultsQuery2 = yield query(sql2, [id]);
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
                    message: "Certificat supprimé avec succès"
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
////////////////////////////////////////
////////   SHOW CERTIFICATE   //////////
///////////////////////////////////////
api.get('/get-certificates/', token_1.authToken, (req, res) => {
    // Get the id user from the token
    const id_users = req.results.id_user;
    // check if the values are not empty
    if (id_users === undefined) {
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
        // Prepare the query to get the certificates
        const sqlQuery = `SELECT tg.id_certificates, c.creationDate, c.note, a.title FROM to_graduate tg
        JOIN articles a USING (id_articles)
        JOIN certificates c USING (id_certificates)
        WHERE tg.id_users = ?`;
        // Execute the query
        connection.query(sqlQuery, [id_users], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            else {
                connection.release();
                // Send the response to the client
                res.status(200).json({
                    body: results
                });
            }
        });
    });
});
////////////////////////////////////////
////////   VIEW CERTIFICATE   //////////
///////////////////////////////////////
api.get('/view-certificate/:id', token_1.authToken, (req, res) => {
    const id_certificates = req.params.id;
    // Get the id user from the token
    const id_users = req.results.id_user;
    // check if the values are not empty
    if (!id_certificates || id_users === undefined) {
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
        // Prepare the query to get the certificates
        const sqlQuery = `SELECT tg.id_certificates, c.creationDate, a.title, u.username
FROM to_graduate tg
JOIN articles a ON tg.id_articles = a.id_articles
JOIN certificates c ON tg.id_certificates = c.id_certificates
JOIN users u ON tg.id_users = u.id_users
WHERE tg.id_certificates = ? AND tg.id_users = ?;`;
        // Execute the query
        connection.query(sqlQuery, [id_certificates, id_users], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            else {
                const queryResult = results;
                // Check if there is any result
                if (queryResult.length === 0) {
                    (0, notifications_2.getJsonResponse)(res, 500, "certificate-not-found", notifications_1.notificationMessages, false);
                    connection.release();
                    return;
                }
                else {
                    connection.release();
                    // Send the response to the client
                    res.status(200).json({
                        username: queryResult[0].username,
                        firstname: queryResult[0].firstname,
                        lastname: queryResult[0].lastname,
                        creationdate: queryResult[0].creationDate,
                        title: queryResult[0].title,
                    });
                }
            }
        });
    });
});
////////////////////////////////////////
////////   SUBMIT RESULTS   //////////
///////////////////////////////////////
api.post('/submit-results/:id', token_1.authToken, (req, res) => {
    const id_articles = req.params.id;
    // check if the values are not empty
    if (id_articles === undefined) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Get values from the request body (results form from user)
    const formResults = req.body;
    // check if the values are not empty
    if (formResults.length === 0) {
        (0, notifications_2.getJsonResponse)(res, 500, "no-questions", notifications_1.notificationMessages, false);
        return;
    }
    // define initial values (to store the good answers)
    let choicesResults = [];
    // define initial array (to store the answers from the user)
    let choicesForms = [];
    // full the array only with user choices (contains id_choices)        
    for (const item of formResults) {
        choicesForms.push(item.id_choice);
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
                // prepare the first query (to get the number of questions in the article)
                const sqlQuery0 = `SELECT id_questions FROM questions WHERE id_articles = ?`;
                // Execute the first query
                let queryResult0 = yield query(sqlQuery0, [id_articles]);
                const questionsArticle = queryResult0.length;
                // prepare the second query (to get the good answers)
                const sql = `SELECT id_choices FROM choices WHERE id_questions = ? AND answer = 1`;
                for (const item of formResults) {
                    // For each question, get the good answers
                    let queryResult = yield query(sql, [item.id_question]);
                    // for each good answer, push the id_choices in the array
                    for (const choice of queryResult) {
                        choicesResults.push(choice.id_choices);
                    }
                }
                ;
                // remove duplicates from the array (if some questions have multiple good answers)
                // Good answers : 
                choicesResults = [...new Set(choicesResults)];
                // compare number of goods answers (choicesResults) with user answers (choicesForms)
                const goodAnswers = choicesResults.filter(value => choicesForms.includes(value));
                // compare number of wrong answers (choicesForms) with user answers (choicesResults)
                const wrongAnswers = choicesForms.filter(value => !choicesResults.includes(value));
                // calculate the total points
                let totalPoints = goodAnswers.length - wrongAnswers.length;
                // prevent negative points
                if (totalPoints < 0) {
                    totalPoints = 0;
                }
                // calculate the total on 20
                let totalSurVingt = Math.round(totalPoints * 20 / choicesResults.length);
                // If all queries succeeded, commit the transaction
                connection.commit((error) => {
                    if (error) {
                        return connection.rollback(() => {
                            throw error;
                        });
                    }
                });
                if (queryResult0.length === 0) {
                    (0, notifications_2.getJsonResponse)(res, 500, "no-questions", notifications_1.notificationMessages, false);
                    return;
                }
                if (questionsArticle > formResults.length) {
                    (0, notifications_2.getJsonResponse)(res, 500, "answers-missing", notifications_1.notificationMessages, false);
                    return;
                }
                // Send the response to the client
                res.status(200).json({
                    formResults: choicesForms,
                    answers: choicesResults,
                    note: totalSurVingt
                });
            }
            catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    console.error('Erreur : ', error);
                    res.status(500).json({
                        message: "Une erreur est survenue lors de l'insertion",
                        error: error
                    });
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
