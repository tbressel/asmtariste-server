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
import CorsConfig from "../../middlewares/CorsConfig";
const corsOptions = CorsConfig.getCorsConfig();
const cors = require('cors');
api.use(cors(corsOptions));

// Body Parser Middleware to check data body from http request & configuration
import { urlEncodedParserMiddleware, jsonParserMiddleware } from "../../middlewares/body-parser";
api.use(urlEncodedParserMiddleware);
api.use(jsonParserMiddleware);

//multer (to record files on the server)
import multer from 'multer';
import path from 'path';

// multer configuration
const storage = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


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


/////////////////////////////////////////////////////
///////////    CLASS & DATAS IMPORTATIONS   /////////
/////////////////////////////////////////////////////
import { tagsStyleList } from "../../datas/tags-style";
import { TagsStyle } from "../../classes/TagsStyle";


///////////////////////////////////////////////////
////////    GET A TEMPLATE FOR CONTENT   ///////////
///////////////////////////////////////////////////
api.post('/article/get-template/:id', upload.none(), (req: Request, res: Response) => {

    // read the data from the POST request
    let { id, templateChoice } = req.body as { id: number, templateChoice: string };

    // Check if id exists
    if (!id || !templateChoice) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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

        // Prepare the query
        const sql: string = `SELECT * FROM templates WHERE id_templates = ?;`;

        // Execute the query
        connection.query(sql, [parseInt(templateChoice), id], (error: Error, results: any) => {
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


///////////////////////////////////////////////////
////////    ADD A CONTENTS TO ARTICLE   ///////////
///////////////////////////////////////////////////
api.post('/article/add-template/:id/:page', upload.fields([
    { name: 'imageLeft', maxCount: 1 },
    { name: 'imageCenter', maxCount: 1 },
    { name: 'imageRight', maxCount: 1 }
]), (req: Request, res: Response) => {


    // read the data from the POST request
    let { id, page, templateChoice, titleLeft, titleRight, titleCenter, textLeft, textRight, textCenter, attachementLeft, attachementRight, attachementCenter } = req.body as {
        id: number, page: number, templateChoice: string, titleLeft: string | null, titleRight: string | null, titleCenter: string | null, textLeft: string | null, textRight: string | null, textCenter: string | null, attachementLeft: string | null, attachementRight: string | null, attachementCenter: string | null
    };

    // Check if id exists
    if (!id || !page || !templateChoice) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Read the files from the request
    let imageLeftFilename: string | null = null;
    let imageCenterFilename: string | null = null;
    let imageRightFilename: string | null = null;

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
    const tagsStyleManager = new TagsStyle(tagsStyleList);
    textLeft = tagsStyleManager.apply(textLeft);
    textCenter = tagsStyleManager.apply(textCenter);
    textRight = tagsStyleManager.apply(textRight);

    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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

        // Prepare the query
        const sql: string = `INSERT INTO contents (title_left, title_center, title_right, text_left, text_center, text_right, image_left, image_center, image_right, attachement_left, attachement_center, attachement_right, page, id_templates, id_articles) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        // Execute the query
        connection.query(sql, [titleLeft, titleCenter, titleRight, textLeft, textCenter, textRight, imageLeftFilename, imageCenterFilename, imageRightFilename, attachementLeft, attachementCenter, attachementRight, page, parseInt(templateChoice), id], (error: Error, results: any) => { });
        if (error) {
            getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
]), (req: Request, res: Response) => {

    // read the data from the POST request
    let { id, page, templateChoice, titleLeft, titleRight, titleCenter, textLeft, textRight, textCenter, attachementLeft, attachementRight, attachementCenter, id_contents } = req.body as { id: number, page: number, templateChoice: string, titleLeft: string | null, titleRight: string | null, titleCenter: string | null, textLeft: string | null, textRight: string | null, textCenter: string | null, attachementLeft: string | null, attachementRight: string | null, attachementCenter: string | null, id_contents: number };

    // Check if id exists
    if (!id || !page || !templateChoice) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Parse the templateChoice to a number
    let templateChoiceNumber: number = parseInt(templateChoice);

    // read the files from the request
    let imageLeftFilename: string | null = null;
    let imageCenterFilename: string | null = null;
    let imageRightFilename: string | null = null;


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
    const tagsStyleManager = new TagsStyle(tagsStyleList);
    textLeft = tagsStyleManager.apply(textLeft);
    textCenter = tagsStyleManager.apply(textCenter);
    textRight = tagsStyleManager.apply(textRight);


    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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

        // Prepare the query
        const sql: string = `UPDATE contents SET title_left = ?, title_center = ?, title_right = ?, text_left = ?, text_center = ?, text_right = ?, image_left = ?, image_center = ?, image_right = ?, attachement_left = ?, attachement_center = ?, attachement_right = ?, page = ?, id_templates = ?, id_articles = ? WHERE id_contents = ?`;

        // Execute the query
        connection.query(sql, [titleLeft, titleCenter, titleRight, textLeft, textCenter, textRight, imageLeftFilename, imageCenterFilename, imageRightFilename, attachementLeft, attachementCenter, attachementRight, page, templateChoiceNumber, id, id_contents], (error: Error, results: any) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
api.delete('/article/remove-content/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // check if id exists
    if (!id) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Establish a connection to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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


        // prepare the first query
        const sql: string = "DELETE FROM contents WHERE id_contents = ?";
        // Execute the 1st query
        connection.query(sql, [id], (error: Error, results: any) => {
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


/////////////////////////////////////////////////////////
////////    GET  TO EDIT A CONTENTS FROM ARTICLE   ///////////
////////////////////////////////////////////////////////
api.get('/article/get-content/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // Check if id exists
    if (!id) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: any) => {
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

        // prepare the first query
        const sql: string = "SELECT * FROM contents WHERE id_contents = ?";

        // Execute the 1st query
        connection.query(sql, [id], (error: Error, results: any) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }

            // Remove the tags style from the text
            const tagsStyleManager = new TagsStyle(tagsStyleList);
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

export default api;