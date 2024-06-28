"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfToken = void 0;
class CsrfToken {
    static getCsrfTokenKeys() {
        return {
            secretKey: this.getSecretKey(),
            refreshKey: this.getRefreshKey(),
            tokenTime: this.getTime()
        };
    }
    /**
       * Method to get the secret key.
       *
       * @returns string
       */
    static getSecretKey() {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (secretKey === undefined) {
            console.error("No secret key set");
        }
        else {
            return secretKey;
        }
    }
    /**
     * Method to get the refresh key.
     *
     * @returns string
     */
    static getRefreshKey() {
        const refreshKey = process.env.JWT_REFRESH_SECRET_KEY;
        if (refreshKey === undefined) {
            console.error("No secret key set");
        }
        else {
            return refreshKey;
        }
    }
    /**
     * Method to get the time for validation.
     *
     * @returns string
     */
    static getTime() {
        const time = process.env.JWT_DURATION;
        if (time === undefined) {
            console.error("No timer set");
        }
        else {
            return time;
        }
    }
}
exports.CsrfToken = CsrfToken;
