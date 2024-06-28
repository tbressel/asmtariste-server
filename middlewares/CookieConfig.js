"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * This class is used to get the cookie configuration from the environment variables
 */
class CookieConfig {
    /**
     *
     * This method is used to get the cookie configuration from the environment variables
     * @returns cookieOptions
     */
    static getCookieConfig() {
        return {
            httpOnly: this.getHttpOnly(),
            sameSite: this.getSameSite()
        };
    }
    /**
     *
     * This method is used to get the httpOnly configuration from the environment variables
     *
     * @returns boolean | undefined
     *
     */
    static getHttpOnly() {
        const httpOnlyString = process.env.COOKIE_HTTP_ONLY;
        if (httpOnlyString === undefined) {
            console.error("No httpOnly set for the cookie");
        }
        else {
            const httpOnly = httpOnlyString === 'true';
            return httpOnly;
        }
    }
    /**
     *
     * This method is used to get the sameSite configuration from the environment variables
     *
     * @returns string | undefined
     */
    static getSameSite() {
        const sameSite = process.env.COOKIE_SAME_SITE;
        if (sameSite === undefined) {
            console.error("No sameSite set for the cookie");
        }
        else {
            return sameSite;
        }
    }
}
exports.default = CookieConfig;
