export interface CsrfTokenType {
    secretKey: string | undefined;
    refreshKey: string | undefined;
    tokenTime: string | undefined;
}

export class CsrfToken {


    public static getCsrfTokenKeys(): CsrfTokenType {
        return {
            secretKey: this.getSecretKey(),
            refreshKey: this.getRefreshKey(),
            tokenTime: this.getTime()
        }
    }


    /**
       * Method to get the secret key.
       * 
       * @returns string
       */
    private static getSecretKey(): string | undefined {
        const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        if (secretKey === undefined) {
            console.error("No secret key set");
        } else {
            return secretKey;
        }
    }


    /**
     * Method to get the refresh key.
     * 
     * @returns string
     */
    private static getRefreshKey(): string | undefined {
        const refreshKey: string | undefined = process.env.JWT_REFRESH_SECRET_KEY;
        if (refreshKey === undefined) {
            console.error("No secret key set");
        } else {
            return refreshKey;
        }
    }
    /**
     * Method to get the time for validation.
     * 
     * @returns string
     */
    private static getTime(): string | undefined {
        const time: string | undefined = process.env.JWT_DURATION;
        if (time === undefined) {
            console.error("No timer set");
        } else {
            return time;
        }
    }

}

