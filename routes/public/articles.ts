/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response, NextFunction } from "express";
const api: Express = express();


/////////////////////////////////////////////////////
///////////    MIDDLEWARES IMPORTATIONS   ///////////
/////////////////////////////////////////////////////

// CORS middleware
const cors = require('cors');
import CorsConfig from "../../middlewares/CorsConfig";
const corsOptions = CorsConfig.getCorsConfig();


api.use(cors(corsOptions));


// Body Parser Middleware to check data body from http request & configuration
import { urlEncodedParserMiddleware, jsonParserMiddleware } from "../../middlewares/body-parser";
api.use(urlEncodedParserMiddleware);
api.use(jsonParserMiddleware);

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

///////////////////////////////////////
//////////   LAST ARTICLES   //////////
///////////////////////////////////////
api.get('/last-articles/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // check if the id exist
    if (!id || id === undefined || id === null) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Create the connection to the database
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

        // prepare the sql query
        const sql: string = `SELECT 
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
        connection.query(sql, [id], (error: Error | null, results: any) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
api.get('/article-content/:id/:page', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // get the page from the slug
    let page: string | number = req.params.page;
    page = parseInt(page);

        // check if the id and page are not empty
        if (!id || !page || id === undefined || page === undefined) {
            getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Create the connection to the database
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

        // prepare the sql query
        const sql: string = `SELECT a.id_articles, a.id_categories, a.title AS article_title,
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



////////////////////////////////////////////
////////   SHOW QUESTIONS FROM   //////////
///////////////////////////////////////////
api.get('/article-questions/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // check if the id exist
    if (!id || id === undefined || id === null) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


    // Create the connection to the database
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

        // prepare the sql query
        const sql: string = `SELECT q.id_questions, q.isMultiple, q.text,
        JSON_ARRAYAGG(JSON_OBJECT(c.id_choices, c.choice_name)) AS choices,
        (SELECT title FROM articles WHERE id_articles = ?) AS title
        FROM questions q
        JOIN choices c USING (id_questions)
        WHERE q.id_articles = ?
        GROUP BY q.id_questions, q.text;`;


        // execute the query
        connection.query(sql, [id, id], (error: Error | null, results: Object) => {
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

