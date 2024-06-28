import { Request, Response, NextFunction } from "express";
import bodyParser, {BodyParser} from "body-parser";

/**
 * 
 * Middleware to parse url encoded data
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function urlEncodedParserMiddleware(req: Request, res: Response, next: NextFunction) {
    bodyParser.urlencoded({
        extended: true 
    })
    (req, res, next);
}

/**
 * 
 * Middleware to parse json data
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function jsonParserMiddleware(req: Request, res: Response, next: NextFunction) {
    bodyParser.json()
    (req, res, next);
}
