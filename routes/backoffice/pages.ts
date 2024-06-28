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


///////////////////////////////////////////////////
////////    ADD A NEW PAGE TO ARTICLE   ///////////
///////////////////////////////////////////////////
api.post('/article/add-page/:id_articles/:id_page', (req: Request, res: Response) => {

    // Extraction des paramètres de l'URL
    let { id_articles, id_page } = req.params as { id_articles: string, id_page: string };

    // Check if page and id exists
    if (!id_articles || !id_page) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Turn the id and the page into integers
    let id = parseInt(id_articles);
    let page = parseInt(id_page);

    // increase the page number
    page += 1;

    // Get a connexion to the database
    dbconnect.getConnection((error: Error, connection: PoolConnection) => {
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

        // Prepare the SQL query
        const sql: string = `SELECT a.id_articles, a.title AS article_title, a.creation_date, a.description AS article_description,
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
        connection.query(sql, [page, page, id], (error: Error | null, results: any) => {
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

        export default api;