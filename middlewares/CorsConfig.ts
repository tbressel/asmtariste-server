
interface corsList {
  origin: string[],
  credentials: boolean | undefined,
  optionsSuccessStatus: 200,
}

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
  public static getCorsConfig(): corsList {
    return {
      origin: this.getOrigins() ?? [],
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
  private static getOrigins(): string[] | undefined {
    const allowedOrigins: string | undefined = process.env.CORS_ALLOWED_ORIGINS;
    if (allowedOrigins === undefined) {
      console.error("No allowed origins set for the cors");
    } else {
      return allowedOrigins.split(',');
    }
  }


  /**
   * 
   * Method to get the credentials for the CORS middleware
   * 
   * @returns boolean | undefined
   */
  private static getCredentials(): boolean | undefined {
    const credentialsString: string | undefined = process.env.CORS_CREDENTIALS;
    if (credentialsString === undefined) {
      console.error("No credentials set for the cors");
    } else {
      const credentials = credentialsString === 'true';
      return credentials;
    }
  }
}

export default CorsConfig;