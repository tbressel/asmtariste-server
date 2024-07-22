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


/////////////////////////////////////////////////////
///////////    LIBRARIES   IMPORTATIONS   ///////////
/////////////////////////////////////////////////////


// Mysql library importation and pool connexion creation
import DatabaseConfig from "../../classes/DatabaseConfig";
import mysql, { PoolConnection } from 'mysql';
import { isMaxConnectionReached } from '../../functions/pool';
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());

// importation of the QueryBuild class
import QueryBuild from "../../classes/QueryBuild";

// importation of notifications messages
import { notificationMessages } from "../../datas/notifications";
import { getJsonResponse } from "../../functions/notifications";
import { authToken } from "../../functions/token";



//////////////////////////////
//////////   GET   ///////////
//////////////////////////////
api.get('/navigation/get-menu-items', (req: Request, res: Response) => {

    // Get Connexion to the database
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

        // Prepare the SQL query
        const sql: string = 'SELECT * FROM menu ORDER BY place ASC';

        // Execute the query
        connection.query(sql, (error: Error, results: Object | undefined) => {
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
/////////////////////////////////
//////////   DELETE   ///////////
/////////////////////////////////
api.delete('/navigation/delete-menu-item/:id', authToken, (req: Request, res: Response) => {

    // get the id in the slug
    let id: string | number = req.params.id;
    const idNumber: number = parseInt(id);

    // Check if the id exists
    if (!idNumber || idNumber === undefined || idNumber === null) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    //  Get a connexion to the database
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
        const sql: string = 'DELETE FROM menu WHERE id_menu = ?';

        // Execute the query
        connection.query(sql, [idNumber], (error: Error | null, results: Object | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
api.patch('/navigation/move-menu-item/:id', authToken, (req: Request, res: Response) => {

    // get the action from the query
    const action = req.query.action;

    // Check if the action is valid
    if (!action || action !== 'up' && action !== 'down') {
        getJsonResponse(res, 500, "invalid_action", notificationMessages, false);
        return;
    }

    // get the id in the slug
    let id: string | number = req.params.id;
    id = parseInt(id);

    // Check if the id exists
    if (!id || id === undefined || id === null) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


    // Establish a connection to the database
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

                // Prepare the 1st query up of down depending on the action
                const sql: string = new QueryBuild().getUpDownQuery(action).queryUpDown;

                // Execute the 1st query
                const results = await query(sql, [id]);

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
                let elements = (results as { place: number, id_menu: number }[]).map(({ place, id_menu }) => ({ place, id_menu }));

                // invert the places
                [elements[0].place, elements[1].place] = [elements[1].place, elements[0].place];


                // For each element, update the place
                elements.forEach(async ({ place, id_menu }) => {

                    // Prepare the next query
                    const sql: string = new QueryBuild().getUpDownQuery(action).queryUpdate;

                    // Execute the query
                    const results = await query(sql, [place, id_menu]);
                });


                // If all queries succeeded, commit the transaction
                connection.commit((error: Error) => {
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
            } catch (error) {
                // If an error occurred, rollback the transaction
                connection.rollback(() => {
                    getJsonResponse(res, 500, "move-failure", notificationMessages, false);
                    return;
                });
            } finally {
                connection.release();
            }
        });
    });
});

/////////////////////////////////
//////////   CREATE   ///////////
/////////////////////////////////

api.post('/navigation/add-menu-item', authToken, (req: Request, res: Response) => {

    // read the data from the POST request
    let { name } = req.body as { name: string };
    name = name.toLowerCase();

    // Check if name exists
    if (!name) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }

    // Define default values
    let link: string = "/" + name.toLowerCase();
    link = link.replace(" ", "-");
    let place: number = 0;

    // Establish a connection to the database
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


        // GET THE MAX PLACE NUMBER TO CALC THE NEW ONE 
        //  Prepare and execute the SQL query
        const sqlMaxPlace = `SELECT MAX(place) as 'maxPlace' FROM menu;`;

        // Execute the query
        connection.query(sqlMaxPlace, (error: Error, results: Array<{ maxPlace: string }> | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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

            let newplace: number = parseInt(results[0].maxPlace) + 1;



            // CHECK NEW ENTRY ALREADY EXISTS
            //  Prepare and execute the SQL query
            const sql = `SELECT name FROM menu WHERE name = ?`;

            // Execute the query
            connection.query(sql, [name], (error: Error, results: Object | undefined) => {
                if (error) {
                    getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
                connection.query(sql, [name, link, newplace], (error: Error, results: Object | undefined) => {
                    if (error) {
                        getJsonResponse(res, 500, "request-failure", notificationMessages, false);
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
api.get('/navigation/get-admin-menu-items', (req: Request, res: Response) => {

    // Get Connexion to the database
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

        // Prepare the SQL query
        const sql: string = 'SELECT * FROM menu_admin';

        // Execute the query
        connection.query(sql, (error: Error, results: Object | undefined) => {
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