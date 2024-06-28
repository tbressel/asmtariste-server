/**
 * The main server file for the React_Node application.
 * @module index
**/


/////////////////////////////////////
////////   IMPORTATIONS   ///////////
/////////////////////////////////////

// ConfigServer importation
import ServerConfig from './classes/ServerConfig';

// Express importation
import express, { Express } from "express";
import path from 'path';

// interface app components routes
import publicRouteArticles from './routes/public/articles';
import publicRouteFiles from './routes/public/files'
import publicRouteCertificates from './routes/public/certificates'
import frontOfficeRouteRegistration from './routes/backoffice/registration'
import backOfficeRouteNavigation from './routes/backoffice/navigation'
import backOfficeRouteArticles from './routes/backoffice/articles'
import backOfficeRouteDiskUnits from './routes/backoffice/disk-units'
import backOfficeRouteContents from './routes/backoffice/contents'
import backOfficeRouteFiles from './routes/backoffice/files'
import backOfficeRoutePages from './routes/backoffice/pages'
import backOfficeRouteUsers from './routes/backoffice/users'

////////////////////////////////////////
////////   DEFINITION USES   ///////////
////////////////////////////////////////

// express definition 
const api: Express = express();

// get port server number from ServerConfig
const configPort: ServerConfig = ServerConfig.getApiListenPort();
    api.listen(configPort, () => {
        console.warn('Server listened on port number ', configPort);
    });
    
////////////////////////////////////////
///////    ROUTES DEFINITION   /////////
////////////////////////////////////////


// use routes for interface display
api.use('', frontOfficeRouteRegistration); 
api.use('', publicRouteArticles); 
api.use('', publicRouteFiles); 
api.use('', backOfficeRouteFiles); 
api.use('', publicRouteCertificates); 
api.use('', backOfficeRouteNavigation); 
api.use('', backOfficeRouteArticles); 
api.use('', backOfficeRouteDiskUnits); 
api.use('', backOfficeRouteContents); 
api.use('', backOfficeRoutePages); 
api.use('', backOfficeRouteUsers); 

// Serve static files from the "uploads" directory
api.use('/files', express.static(path.join(__dirname, 'files')));
api.use('/images', express.static(path.join(__dirname, 'images')));
api.use('/downloads', express.static(path.join(__dirname, 'downloads')));

