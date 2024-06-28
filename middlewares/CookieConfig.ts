interface cookieOptions {
    httpOnly : boolean | undefined,
    sameSite : "lax" | "strict" | "none" | boolean | undefined
}

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
    public static getCookieConfig(): cookieOptions {
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
    private static getHttpOnly(): boolean | undefined {
        const httpOnlyString: string | undefined = process.env.COOKIE_HTTP_ONLY;
        if (httpOnlyString === undefined) {
            console.error("No httpOnly set for the cookie");
        } else {
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
    private static getSameSite(): "lax" | "strict" | "none" | boolean | undefined {
        const sameSite: string | undefined = process.env.COOKIE_SAME_SITE;
        if (sameSite === undefined) {
            console.error("No sameSite set for the cookie");
        } else {
            return sameSite as "lax" | "strict" | "none" | boolean;
        }
    }

}


export default CookieConfig;