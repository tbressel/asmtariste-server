/////////////////////////////////////////////////////
///////////  IMPORTATIONS & CONFIGURATION ///////////
/////////////////////////////////////////////////////

// Express importation & definition
import express, { Express, Request, Response } from "express";
const api: Express = express();

// Body Parser Middleware to check data body from http request & configuration
import { urlEncodedParserMiddleware, jsonParserMiddleware } from "../middlewares/body-parser";
api.use(urlEncodedParserMiddleware);
api.use(jsonParserMiddleware);

// Mysql library importation and pool connexion creation
import DatabaseConfig from "./DatabaseConfig";
import mysql from 'mysql';
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());

// importation of the QueryBuild class
import QueryBuild from "./QueryBuild";



// CORS middleware
const cors = require('cors');
const corsOptions = {
    origin: ['https://www.asmtariste.fr', 'http://www.asmtariste.fr', 'www.asmtariste.fr'],
    optionsSuccessStatus: 200
};

// Middleware to allow CORS
api.use(cors(corsOptions));

export default { api, dbconnect, QueryBuild, corsOptions, cors, urlEncodedParserMiddleware, jsonParserMiddleware, DatabaseConfig, mysql, express, Request, Response}