"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMaxConnectionReached = void 0;
/**
 *
 * Function return true if max connexion to database is reached
 *
 * @param dbconnect
 * @returns boolean
 */
function isMaxConnectionReached(dbconnect) {
    // Get stat about connection states
    const allConnections = dbconnect._allConnections.length;
    console.log("Nombres de connexions : ", allConnections);
    const connectionsLimit = dbconnect.config.connectionLimit;
    console.log("Nombre max autorisé : ", connectionsLimit);
    // Check if we reached the maximum of connection allowed
    return (allConnections >= connectionsLimit) ? true : false;
}
exports.isMaxConnectionReached = isMaxConnectionReached;
