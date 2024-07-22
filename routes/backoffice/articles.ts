/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response } from "express";
const api: Express = express();

// Import promisify to convert connection.query into a function that returns a promise
import { promisify } from 'util';

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




/////////////////////////////////
//////////   CREATE   ///////////
/////////////////////////////////

api.post('/article/create', upload.single('coverImage'), (req: Request, res: Response) => {

    // Define the variables role user to 1 (admin) in the wait of the authentification system coding
    let id_users: number = 1;

    // Define the default variable isDisplay to false
    let isDisplay: boolean = false;

    

    // read the data from the POST request
    let { title, description, idTagsList, idCategory, coverImage } = req.body as { title: string, description: string, idTagsList: string, idCategory: string, coverImage: File | null };


    // Check if the data are correct
    if (!title || !description || !idTagsList || !idCategory) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // convert the idTagsList string into an array of numbers
    let id_tags = JSON.parse(idTagsList) as number[];

    // convert the idCategory string into a number
    let id_categories: number = parseInt(idCategory);
    
    // create the creation date
    const creationDate: Date = new Date();

    // Create the cover filename while reading into file
    let coverFilename: string | undefined;
    if (req.file) {
        coverFilename = req.file.filename;
    }

    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: Object | any) => {
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

        // Convert connection.query into a function that returns a promise
        const query = promisify(connection.query).bind(connection);

        // Start a transaction to execute or rollback the both queries
        connection.beginTransaction(async (error: Error) => {
            if (error) {
                getJsonResponse(res, 500, "transaction-start-failed", notificationMessages, false);
                connection.release();
                return;
            }

            try {
                // Prepare the first query
                const sql: string = "INSERT INTO articles (title, description, creation_date, cover, id_users, id_categories, isDisplay) VALUES (?, ?, ?, ?, ?, ?, ?)";

                // Execute the 1st query
                const results = await query(sql, [title, description, creationDate, coverFilename, id_users, id_categories, isDisplay]);

                // Prepare the second query
                const sql2: string = "INSERT INTO to_have (id_articles, id_tags) VALUES (?, ?)";

                // Execute the 2nd query for each tag
                for (const id_tag of id_tags) {
                    await query(sql2, [results.insertId, id_tag]);
                };


                // If all queries succeeded, commit the transaction
                connection.commit((error: Error) => {
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
            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                    return;
                });
            } finally {
                // Release the connection
                connection.release();
            }
        });
    });

});


////////////////////////////////////////
//////////   GET TAGS LIST   ///////////
////////////////////////////////////////

api.get('/article/tags-list', (req: Request, res: Response) => {

    // Get a connexion to the database
    dbconnect.getConnection((error: Error, connection: Object | any) => {
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

        // prepare the query
        const sql = "SELECT * FROM tags";

        // Execute the query
        connection.query(sql, (error: Error, results: any) => {
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

//////////////////////////////////////////////
//////////   GET CATEGORIES LIST   ///////////
/////////////////////////////////////////////

api.get('/article/categories-list', (req: Request, res: Response) => {

    // Get a connexion to the database
    dbconnect.getConnection((error: Error, connection: Object | any) => {
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

        // prepare the query
        const sql = "SELECT * FROM categories";

        // Execute the query
        connection.query(sql, (error: Error, results: any) => {
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



/////////////////////////////////////
////////    ALL ARTICLES   //////////
/////////////////////////////////////
api.get('/all-articles', (req: Request, res: Response) => {

    // Get a connexion to the database
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

        // prepare the query
        const sql: string = `SELECT 
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

        connection.query(sql, (error: Error, results: any) => {
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


///////////////////////////////////////////////////////
//////////     DISPLAY OR HIDE ARTICLES     ///////////
///////////////////////////////////////////////////////

interface isDisplayedArticle {
    isDisplay: boolean;
}

api.patch('/article/is-displayed/:id', (req: Request, res: Response) => {

    // get the id in the slug
    let id: string | number = req.params.id;

    // Convert the id into a number
    id = parseInt(id);

    // Check if id exists
    if (!id) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }
    
    // Get a connection to the database
    dbconnect.getConnection((error: Error, connection: Object | any) => {
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


        // Prepare the 1st query up of down depending on the action
        const sql: string = 'SELECT isDisplay FROM articles WHERE id_articles = ?';

        // Execute the 1st query
        connection.query(sql, [id], (error: Error, results: isDisplayedArticle[] | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
                const sql2: string = 'UPDATE articles SET isDisplay = ? WHERE id_articles = ?;';
                
                // Invert the boolean value
                const queryResult: boolean = results !== undefined && results.length > 0 ? !results[0].isDisplay : false;

                // Execute the 2nd query
                connection.query(sql2, [queryResult, id], (error: Error, results: Object | undefined) => {
                    if (error) {
                        getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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

api.get('/article/select-article/:id/:page', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);
    let page: string | number = req.params.page;
    page = parseInt(page);

    // Check if id and page exists
    if (!id || !page) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Get a connexion to the database
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

        // prepare the query
        const sql: string = ` SELECT a.id_articles, a.title AS article_title, a.creation_date, a.description AS article_description,
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
        connection.query(sql, [id, page], (error: Error, results: any) => {
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
////////    DELETE THE ARTICLE   ///////////
////////////////////////////////////////////
api.delete('/article/delete/:id', (req: Request, res: Response) => {

    // get the id from the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // Check if id exists
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

        // Start a transaction to execute or rollback the both queries
        connection.beginTransaction(async (error: Error) => {
            if (error) {
                getJsonResponse(res, 500, "transaction-start-failed", notificationMessages, false);
                connection.release();
                return;
            }

            // Convert connection.query into a function that returns a promise 
            const query = promisify(connection.query).bind(connection);

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
                const sql: string = "DELETE FROM to_have WHERE id_articles = ?";

                // Execute the 1st query
                const resultsQuery1 = await query(sql, [id]);

                // prepare the 2nd query
                const sql3: string = "DELETE FROM contents WHERE id_articles = ?";

                // Execute the 2nd query
                const resultsQuery3 = await query(sql3, [id]);

                // Désactiver les vérifications des clés étrangères
                await query("SET FOREIGN_KEY_CHECKS=0");
                //  prepare the third query
                const sql2: string = "DELETE FROM articles WHERE id_articles = ?";

                // Execute the 3rd query
                const resultsQuery2 = await query(sql2, [id]);

                // Réactiver les vérifications des clés étrangères
                await query("SET FOREIGN_KEY_CHECKS=1");

                // If all queries succeeded, commit the transaction
                connection.commit((err: Error) => {
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

            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "certificate-failure", notificationMessages, false);
                    return;
                });
            } finally {
                // Release the connection
                connection.release();
            }
        });
    });
});




export default api;