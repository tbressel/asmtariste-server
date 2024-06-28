import { RequestHandler } from "express";
import cookieParser from 'cookie-parser';

const cookieParserMiddleware: RequestHandler = cookieParser();

export default cookieParserMiddleware;