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
///////////////////////////////////////////////////
////////    ADD A NEW PAGE TO ARTICLE   ///////////
///////////////////////////////////////////////////
api.post('/article/add-page/:id_articles/:id_page', (req, res) => {
    // Extraction des paramètres de l'URL
    let { id_articles, id_page } = req.params;
    // Check if page and id exists
    if (!id_articles || !id_page) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Turn the id and the page into integers
    let id = parseInt(id_articles);
    let page = parseInt(id_page);
    // increase the page number
    page += 1;
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
        // Prepare the SQL query
        const sql = `SELECT a.id_articles, a.title AS article_title, a.creation_date, a.description AS article_description,
        a.cover AS article_cover, u.username, c.id_contents, c.title_left, c.title_center, c.title_right, c.text_left,
        c.text_center, c.text_right, c.image_left, c.image_center, c.image_right, c.attachement_left, c.attachement_center,
        c.attachement_right, ? as page
        FROM 
        articles a
        LEFT JOIN 
        contents c ON a.id_articles = c.id_articles AND (c.page = ? OR c.page IS NULL)
        JOIN 
        users u ON a.id_users = u.id_users
        WHERE 
        a.id_articles = ?;`;
        // Execute the query
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
exports.default = api;
