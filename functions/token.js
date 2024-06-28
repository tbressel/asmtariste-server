"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const CsrfToken_1 = require("../classes/CsrfToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// importation of notifications messages
const notifications_1 = require("../datas/notifications");
const notifications_2 = require("../functions/notifications");
/**
 *
 * function to verify the token for certain routes
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function authToken(req, res, next) {
    //  Get the token from the header juste after authorization keyword
    const header = req.headers['authorization'];
    // Split Bearer from the token value and keep just the token
    const token = header && header.split(' ')[1];
    // Test if the token is missing or null of undefined
    if (!token || token === undefined || token === null || token === 'null') {
        res.status(500).json({ message: 'Erreur il manque le token' });
        return;
    }
    // Get the secret key from the CsrfToken class
    const csrfTokenKeys = CsrfToken_1.CsrfToken.getCsrfTokenKeys();
    const secretKey = csrfTokenKeys.secretKey;
    // Test if the secret key is missing or null of undefined
    if (!secretKey || secretKey === null || secretKey === undefined) {
        res.status(500).json({ message: 'Erreur il manque la clé secrète' });
        return;
    }
    // Verify the token with the secret key
    jsonwebtoken_1.default.verify(token, secretKey, (error, results) => {
        // if it's a wrond token then return an error
        if (error) {
            (0, notifications_2.getJsonResponse)(res, 500, "session-over", notifications_1.notificationMessages, false);
            return;
        }
        // Add the results to the request object
        req.results = results;
        // go to the next middleware 
        next();
    });
}
exports.authToken = authToken;
