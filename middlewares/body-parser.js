"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonParserMiddleware = exports.urlEncodedParserMiddleware = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
/**
 *
 * Middleware to parse url encoded data
 *
 * @param req
 * @param res
 * @param next
 */
function urlEncodedParserMiddleware(req, res, next) {
    body_parser_1.default.urlencoded({
        extended: true
    })(req, res, next);
}
exports.urlEncodedParserMiddleware = urlEncodedParserMiddleware;
/**
 *
 * Middleware to parse json data
 *
 * @param req
 * @param res
 * @param next
 */
function jsonParserMiddleware(req, res, next) {
    body_parser_1.default.json()(req, res, next);
}
exports.jsonParserMiddleware = jsonParserMiddleware;
