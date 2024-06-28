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
/////////////////////////////////////////////////////
///////////    CLASS & DATAS IMPORTATIONS   /////////
/////////////////////////////////////////////////////
const tags_style_1 = require("../../datas/tags-style");
const TagsStyle_1 = require("../../classes/TagsStyle");
///////////////////////////////////////////////////
////////    GET A TEMPLATE FOR CONTENT   ///////////
///////////////////////////////////////////////////
api.post('/article/get-template/:id', upload.none(), (req, res) => {
    // read the data from the POST request
    let { id, templateChoice } = req.body;
    // Check if id exists
    if (!id || !templateChoice) {
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
        // Prepare the query
        const sql = `SELECT * FROM templates WHERE id_templates = ?;`;
        // Execute the query
        connection.query(sql, [parseInt(templateChoice), id], (error, results) => {
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
///////////////////////////////////////////////////
////////    ADD A CONTENTS TO ARTICLE   ///////////
///////////////////////////////////////////////////
api.post('/article/add-template/:id/:page', upload.fields([
    { name: 'imageLeft', maxCount: 1 },
    { name: 'imageCenter', maxCount: 1 },
    { name: 'imageRight', maxCount: 1 }
]), (req, res) => {
    // read the data from the POST request
    let { id, page, templateChoice, titleLeft, titleRight, titleCenter, textLeft, textRight, textCenter, attachementLeft, attachementRight, attachementCenter } = req.body;
    // Check if id exists
    if (!id || !page || !templateChoice) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Read the files from the request
    let imageLeftFilename = null;
    let imageCenterFilename = null;
    let imageRightFilename = null;
    // Get the filname of each image red in req.files
    if (req.files) {
        if ('imageLeft' in req.files && req.files['imageLeft'][0]) {
            imageLeftFilename = req.files['imageLeft'][0].filename;
        }
        if ('imageRight' in req.files && req.files['imageRight'][0]) {
            imageRightFilename = req.files['imageRight'][0].filename;
        }
        if ('imageCenter' in req.files && req.files['imageCenter'][0]) {
            imageCenterFilename = req.files['imageCenter'][0].filename;
        }
    }
    // Apply the tags style to the text
    const tagsStyleManager = new TagsStyle_1.TagsStyle(tags_style_1.tagsStyleList);
    textLeft = tagsStyleManager.apply(textLeft);
    textCenter = tagsStyleManager.apply(textCenter);
    textRight = tagsStyleManager.apply(textRight);
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
        // Prepare the query
        const sql = `INSERT INTO contents (title_left, title_center, title_right, text_left, text_center, text_right, image_left, image_center, image_right, attachement_left, attachement_center, attachement_right, page, id_templates, id_articles) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        // Execute the query
        connection.query(sql, [titleLeft, titleCenter, titleRight, textLeft, textCenter, textRight, imageLeftFilename, imageCenterFilename, imageRightFilename, attachementLeft, attachementCenter, attachementRight, page, parseInt(templateChoice), id], (error, results) => { });
        if (error) {
            (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
            connection.release();
            return;
        }
        connection.release();
        res.status(200).json({
            body: req.body
        });
    });
});
///////////////////////////////////////////////////
////////    UPDATE A CONTENTS TO ARTICLE   ///////////
///////////////////////////////////////////////////
api.put('/article/update-template/:id/:page', upload.fields([
    { name: 'imageLeft', maxCount: 1 },
    { name: 'imageCenter', maxCount: 1 },
    { name: 'imageRight', maxCount: 1 }
]), (req, res) => {
    // read the data from the POST request
    let { id, page, templateChoice, titleLeft, titleRight, titleCenter, textLeft, textRight, textCenter, attachementLeft, attachementRight, attachementCenter, id_contents } = req.body;
    // Check if id exists
    if (!id || !page || !templateChoice) {
        (0, notifications_2.getJsonResponse)(res, 500, "missing-datas", notifications_1.notificationMessages, false);
        return;
    }
    // Parse the templateChoice to a number
    let templateChoiceNumber = parseInt(templateChoice);
    // read the files from the request
    let imageLeftFilename = null;
    let imageCenterFilename = null;
    let imageRightFilename = null;
    // get the filname of each image red in req.files
    if (req.files) {
        if ('imageLeft' in req.files && req.files['imageLeft'][0]) {
            imageLeftFilename = req.files['imageLeft'][0].filename;
        }
        if ('imageRight' in req.files && req.files['imageRight'][0]) {
            imageRightFilename = req.files['imageRight'][0].filename;
        }
        if ('imageCenter' in req.files && req.files['imageCenter'][0]) {
            imageCenterFilename = req.files['imageCenter'][0].filename;
        }
    }
    // Apply the tags style to the text
    const tagsStyleManager = new TagsStyle_1.TagsStyle(tags_style_1.tagsStyleList);
    textLeft = tagsStyleManager.apply(textLeft);
    textCenter = tagsStyleManager.apply(textCenter);
    textRight = tagsStyleManager.apply(textRight);
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
        // Prepare the query
        const sql = `UPDATE contents SET title_left = ?, title_center = ?, title_right = ?, text_left = ?, text_center = ?, text_right = ?, image_left = ?, image_center = ?, image_right = ?, attachement_left = ?, attachement_center = ?, attachement_right = ?, page = ?, id_templates = ?, id_articles = ? WHERE id_contents = ?`;
        // Execute the query
        connection.query(sql, [titleLeft, titleCenter, titleRight, textLeft, textCenter, textRight, imageLeftFilename, imageCenterFilename, imageRightFilename, attachementLeft, attachementCenter, attachementRight, page, templateChoiceNumber, id, id_contents], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
        });
        connection.release();
        res.status(200).json({
            body: req.body
        });
    });
});
/////////////////////////////////////////////////////////
////////    REMOVE A CONTENTS FROM ARTICLE   ///////////
////////////////////////////////////////////////////////
api.delete('/article/remove-content/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
    id = parseInt(id);
    // check if id exists
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
        // prepare the first query
        const sql = "DELETE FROM contents WHERE id_contents = ?";
        // Execute the 1st query
        connection.query(sql, [id], (error, results) => {
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
/////////////////////////////////////////////////////////
////////    GET  TO EDIT A CONTENTS FROM ARTICLE   ///////////
////////////////////////////////////////////////////////
api.get('/article/get-content/:id', (req, res) => {
    // get the id from the slug
    let id = req.params.id;
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
        // prepare the first query
        const sql = "SELECT * FROM contents WHERE id_contents = ?";
        // Execute the 1st query
        connection.query(sql, [id], (error, results) => {
            if (error) {
                (0, notifications_2.getJsonResponse)(res, 500, "request-failure", notifications_1.notificationMessages, false);
                connection.release();
                return;
            }
            // Remove the tags style from the text
            const tagsStyleManager = new TagsStyle_1.TagsStyle(tags_style_1.tagsStyleList);
            results[0].text_center = tagsStyleManager.remove(results[0].text_center);
            results[0].text_left = tagsStyleManager.remove(results[0].text_left);
            results[0].text_right = tagsStyleManager.remove(results[0].text_right);
            connection.release();
            res.status(200).json({
                body: results
            });
        });
    });
});
exports.default = api;
