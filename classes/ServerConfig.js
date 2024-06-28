"use strict";
// import dotenv from 'dotenv';
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
class ServerConfig {
    static getApiListenPort() {
        const portConfig = process.env.API_LISTEN_PORT;
        if (portConfig == undefined) {
            console.error("No adress port defined for the server");
            process.exit(1);
        }
        else {
            const port = parseInt(portConfig);
            return port;
        }
    }
}
exports.default = ServerConfig;
