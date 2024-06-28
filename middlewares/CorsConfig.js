"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * This class is used to configure the CORS middleware
 *
 */
class CorsConfig {
    /**
     *
     * @returns corsList
     *
     * This method returns the configuration of the CORS middleware
     *
     */
    static getCorsConfig() {
        var _a;
        return {
            origin: (_a = this.getOrigins()) !== null && _a !== void 0 ? _a : [],
            credentials: this.getCredentials(),
            optionsSuccessStatus: 200
        };
    }
    /**
     *
     * @returns string[] | undefined
     *
     * This method returns the allowed origins for the CORS middleware
     *
     */
    static getOrigins() {
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
        if (allowedOrigins === undefined) {
            console.error("No allowed origins set for the cors");
        }
        else {
            return allowedOrigins.split(',');
        }
    }
    /**
     *
     * Method to get the credentials for the CORS middleware
     *
     * @returns boolean | undefined
     */
    static getCredentials() {
        const credentialsString = process.env.CORS_CREDENTIALS;
        if (credentialsString === undefined) {
            console.error("No credentials set for the cors");
        }
        else {
            const credentials = credentialsString === 'true';
            return credentials;
        }
    }
}
exports.default = CorsConfig;
