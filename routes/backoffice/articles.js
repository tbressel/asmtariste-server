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
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
// importation of notifications messages
const notifications_1 = require("../../datas/notifications");
const notifications_2 = require("../../functions/notifications");
/////////////////////////////////
//////////   CREATE   ///////////
/////////////////////////////////
api.post('/article/create', upload.single('coverImage'), (req, res) => {
    // Define the variables role user to 1 (admin) in the wait of the authentification system coding
    let id_users = 1;
    // Define the default variable isDisplay to false
    let isDisplay = false;
    // read the data from the POST request
    let { title, description, idTagsList, idCategory, coverImage } = req.body;
    // Check if the data are correct
    if (!title || !description || !idTagsList || !idCategory) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // convert the idTagsList string into an array of numbers
    let id_tags = JSON.parse(idTagsList);
    // convert the idCategory string into a number
    let id_categories = parseInt(idCategory);
    // create the creation date
    const creationDate = new Date();
    // Create the cover filename while reading into file
    let coverFilename;
    if (req.file) {
        coverFilename = req.file.filename;
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
                const sql = "INSERT INTO articles (title, description, creation_date, cover, id_users, id_categories, isDisplay) VALUES (?, ?, ?, ?, ?, ?, ?)";
                // Execute the 1st query
                const results = yield query(sql, [title, description, creationDate, coverFilename, id_users, id_categories, isDisplay]);
                // Prepare the second query
                const sql2 = "INSERT INTO to_have (id_articles, id_tags) VALUES (?, ?)";
                // Execute the 2nd query for each tag
                for (const id_tag of id_tags) {
                    yield query(sql2, [results.insertId, id_tag]);
                }
                ;
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
                    Title: title,
                    Description: description,
                    CreationDate: creationDate,
                    CoverFilename: coverFilename,
                    id_users: id_users,
                    id_categories: id_categories,
                    id_tags: id_tags
                });
            }
            catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
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
////////////////////////////////////////
//////////   GET TAGS LIST   ///////////
////////////////////////////////////////
api.get('/article/tags-list', (req, res) => {
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
        const sql = "SELECT * FROM tags";
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
//////////////////////////////////////////////
//////////   GET CATEGORIES LIST   ///////////
/////////////////////////////////////////////
api.get('/article/categories-list', (req, res) => {
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
        const sql = "SELECT * FROM categories";
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
/////////////////////////////////////
////////    ALL ARTICLES   //////////
/////////////////////////////////////
api.get('/all-articles', (req, res) => {
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
        const sql = `SELECT 
    articles.id_articles, 
    articles.title, 
    articles.creation_date, 
    articles.isDisplay, 
    CONCAT(SUBSTRING(articles.description, 1, 50), '...') AS description, 
    categories.name AS category, 
    users.username
FROM 
    articles
JOIN 
    users ON articles.id_users = users.id_users
JOIN
    categories ON articles.id_categories = categories.id_categories

ORDER BY 
    articles.creation_date ASC;`;
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
api.patch('/article/is-displayed/:id', (req, res) => {
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
        const sql = 'SELECT isDisplay FROM articles WHERE id_articles = ?';
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
            // Check if results contains elements
            if (results && Object.keys(results).length > 0) {
                // Prepare the 1st query up of down depending on the action
                const sql2 = 'UPDATE articles SET isDisplay = ? WHERE id_articles = ?;';
                // Invert the boolean value
                const queryResult = results !== undefined && results.length > 0 ? !results[0].isDisplay : false;
                // Execute the 2nd query
                connection.query(sql2, [queryResult, id], (error, results) => {
                    if (error) {
                        (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                        connection.release();
                        return;
                    }
                });
                res.status(200).json({
                    message: "parfait",
                    body: results
                });
                // Release the connection
                connection.release();
                return;
            }
        });
    });
});
//////////////////////////////////////////////////////
////////    SELECT THE ARTICLE TO MODIFY   ///////////
//////////////////////////////////////////////////////
api.get('/article/select-article/:id/:page', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    let page = req.params.page;
    page = parseInt(page);
    // Check if id and page exists
    if (!id || !page) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
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
        const sql = ` SELECT a.id_articles, a.title AS article_title, a.creation_date, a.description AS article_description,
    a.cover AS article_cover, u.username, c.id_contents, c.title_left, c.title_center, c.title_right, c.text_left, c.text_center,
    c.text_right, c.image_left, c.image_center, c.image_right, c.attachement_left, c.attachement_center, c.attachement_right,
     COALESCE(c.page, 1) as page
FROM 
    articles a
LEFT JOIN 
    contents c ON a.id_articles = c.id_articles
JOIN 
    users u ON a.id_users = u.id_users
WHERE 
    a.id_articles = ? AND COALESCE(c.page, 1) = ?;`;
        // Execute the query
        connection.query(sql, [id, page], (error, results) => {
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
////////////////////////////////////////////
////////    DELETE THE ARTICLE   ///////////
////////////////////////////////////////////
api.delete('/article/delete/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // Check if id exists
    if (!id) {
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
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////// TO DELETE CERTIFICATES ASSOCIATED TO THE ARTICLES //////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
                // // prepare the zero query
                // const sqla: string = "SELECT id_certificates FROM to_graduate WHERE id_articles = ?";
                // // Execute the 0 query
                // const resultsQuerya = await query(sqla, [id]);
                // // prepare the zero query
                // const sql0: string = "DELETE FROM to_graduate WHERE id_articles = ?";
                // // Execute the 0 query
                // const resultsQuery0 = await query(sql0, [id]);
                // // Boucle sur chaque résultat pour supprimer les entrées correspondantes
                // for (const row of resultsQuerya) {
                //     const deleteSql = "DELETE FROM certificates WHERE id_certificates = ?";
                //     const deleteQuery = await query(deleteSql, [row.id_certificates]);
                // }
                ///////////////////////////////////////////////////////////////////////////////////
                ////////////////////////// TO DELETE CONTENT AND ARTICLE //////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////
                // prepare the first query
                const sql = "DELETE FROM to_have WHERE id_articles = ?";
                // Execute the 1st query
                const resultsQuery1 = yield query(sql, [id]);
                // prepare the 2nd query
                const sql3 = "DELETE FROM contents WHERE id_articles = ?";
                // Execute the 2nd query
                const resultsQuery3 = yield query(sql3, [id]);
                // Désactiver les vérifications des clés étrangères
                yield query("SET FOREIGN_KEY_CHECKS=0");
                //  prepare the third query
                const sql2 = "DELETE FROM articles WHERE id_articles = ?";
                // Execute the 3rd query
                const resultsQuery2 = yield query(sql2, [id]);
                // Réactiver les vérifications des clés étrangères
                yield query("SET FOREIGN_KEY_CHECKS=1");
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
                    message: "Article supprimé"
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
