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
///////////////////////////////////////
//////////   LAST ARTICLES   //////////
///////////////////////////////////////
api.get('/last-articles/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // check if the id exist
    if (!id || id === undefined || id === null) {
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
        // prepare the sql query
        const sql = `SELECT 
        articles.id_articles, 
        articles.title, 
        articles.creation_date, 
        CONCAT(SUBSTRING(articles.description, 1, 128), '...') AS description,  
        articles.cover, 
        users.username, 
        GROUP_CONCAT(tags.label) AS tags,
        articles.id_categories
    FROM 
        articles
    JOIN 
        users ON articles.id_users = users.id_users
    JOIN
        to_have ON articles.id_articles = to_have.id_articles
    JOIN
        tags ON to_have.id_tags = tags.id_tags
        
    WHERE articles.isDisplay = 1 AND articles.id_categories = ?
    
    GROUP BY 
        articles.id_articles
    ORDER BY 
        articles.creation_date ASC`;
        // execute the query
        connection.query(sql, [id], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Convert tags from string to array
            for (let i = 0; i < results.length; i++) {
                results[i].tags = results[i].tags.split(',');
            }
            connection.release();
            res.status(200).json({
                body: results
            });
        });
    });
});
/////////////////////////////////////
////////   SHOW ARTICLE   //////////
/////////////////////////////////////
api.get('/article-content/:id/:page', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // get the page from the slug
    let page = req.params.page;
    page = parseInt(page);
    // check if the id and page are not empty
    if (!id || !page || id === undefined || page === undefined) {
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
        // prepare the sql query
        const sql = `SELECT a.id_articles, a.id_categories, a.title AS article_title,
    a.creation_date, a.description AS article_description, a.cover AS article_cover, u.username,
    c.id_contents, c.title_left, c.title_center, c.title_right, c.text_left, c.text_center,
    c.text_right, c.image_left, c.image_center, c.image_right, c.attachement_left, c.attachement_center,
    c.attachement_right, ? AS page,
    
        (SELECT MAX(page) FROM contents WHERE id_articles = a.id_articles) AS max_page
    FROM 
        articles a
    LEFT JOIN 
        contents c ON a.id_articles = c.id_articles AND (c.page = ? OR c.page IS NULL)
    JOIN 
        users u ON a.id_users = u.id_users
    WHERE 
        a.id_articles = ?;`;
        // execute the query
        connection.query(sql, [page, page, id], (error, results) => {
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
////////   SHOW QUESTIONS FROM   //////////
///////////////////////////////////////////
api.get('/article-questions/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // check if the id exist
    if (!id || id === undefined || id === null) {
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
        // prepare the sql query
        const sql = `SELECT q.id_questions, q.isMultiple, q.text,
        JSON_ARRAYAGG(JSON_OBJECT(c.id_choices, c.choice_name)) AS choices,
        (SELECT title FROM articles WHERE id_articles = ?) AS title
        FROM questions q
        JOIN choices c USING (id_questions)
        WHERE q.id_articles = ?
        GROUP BY q.id_questions, q.text;`;
        // execute the query
        connection.query(sql, [id, id], (error, results) => {
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
