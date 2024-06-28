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
// Body Parser Middleware to check data body from http request & configuration
const body_parser_1 = require("../middlewares/body-parser");
api.use(body_parser_1.urlEncodedParserMiddleware);
api.use(body_parser_1.jsonParserMiddleware);
// Mysql library importation and pool connexion creation
const DatabaseConfig_1 = __importDefault(require("./DatabaseConfig"));
const mysql_1 = __importDefault(require("mysql"));
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
// importation of the QueryBuild class
const QueryBuild_1 = __importDefault(require("./QueryBuild"));
// CORS middleware
const cors = require('cors');
const corsOptions = {
    origin: ['https://www.asmtariste.fr', 'http://www.asmtariste.fr', 'www.asmtariste.fr'],
    optionsSuccessStatus: 200
};
// Middleware to allow CORS
api.use(cors(corsOptions));
exports.default = { api, dbconnect, QueryBuild: QueryBuild_1.default, corsOptions, cors, urlEncodedParserMiddleware: body_parser_1.urlEncodedParserMiddleware, jsonParserMiddleware: body_parser_1.jsonParserMiddleware, DatabaseConfig: DatabaseConfig_1.default, mysql: mysql_1.default, express: express_1.default, Request, Response };
