"use strict";
/**
 * The main server file for the React_Node application.
 * @module index
**/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////////////////////
////////   IMPORTATIONS   ///////////
/////////////////////////////////////
// ConfigServer importation
const ServerConfig_1 = __importDefault(require("./classes/ServerConfig"));
// Express importation
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// interface app components routes
const articles_1 = __importDefault(require("./routes/public/articles"));
const files_1 = __importDefault(require("./routes/public/files"));
const certificates_1 = __importDefault(require("./routes/public/certificates"));
const registration_1 = __importDefault(require("./routes/backoffice/registration"));
const navigation_1 = __importDefault(require("./routes/backoffice/navigation"));
const articles_2 = __importDefault(require("./routes/backoffice/articles"));
const disk_units_1 = __importDefault(require("./routes/backoffice/disk-units"));
const contents_1 = __importDefault(require("./routes/backoffice/contents"));
const files_2 = __importDefault(require("./routes/backoffice/files"));
const pages_1 = __importDefault(require("./routes/backoffice/pages"));
const users_1 = __importDefault(require("./routes/backoffice/users"));
////////////////////////////////////////
////////   DEFINITION USES   ///////////
////////////////////////////////////////
// express definition 
const api = (0, express_1.default)();
// get port server number from ServerConfig
const configPort = ServerConfig_1.default.getApiListenPort();
api.listen(configPort, () => {
    console.warn('Server listened on port number ', configPort);
});
////////////////////////////////////////
///////    ROUTES DEFINITION   /////////
////////////////////////////////////////
// use routes for interface display
api.use('', registration_1.default);
api.use('', articles_1.default);
api.use('', files_1.default);
api.use('', files_2.default);
api.use('', certificates_1.default);
api.use('', navigation_1.default);
api.use('', articles_2.default);
api.use('', disk_units_1.default);
api.use('', contents_1.default);
api.use('', pages_1.default);
api.use('', users_1.default);
// Serve static files from the "uploads" directory
api.use('/files', express_1.default.static(path_1.default.join(__dirname, 'files')));
api.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
api.use('/downloads', express_1.default.static(path_1.default.join(__dirname, 'downloads')));
