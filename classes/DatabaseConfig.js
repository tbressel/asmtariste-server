"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseConfig {
    /**
     * Method to get the database configuration.
     *
     * @returns object
     */
    static getDbConfig() {
        return {
            connectionLimit: this.getPoolLimit(),
            host: this.getHost(),
            user: this.getUsername(),
            password: this.getPassword(),
            database: this.getDataName(),
            port: this.getListenPort()
        };
    }
    /**
     * Method to get the number of pool connections.
     *
     * @returns number
     */
    static getPoolLimit() {
        const poolLimit = process.env.DB_CONNEXION_LIMIT;
        if (poolLimit === undefined) {
            console.error("No connection limit set for the database");
        }
        else {
            return parseInt(poolLimit);
        }
    }
    /**
     * Method to get the port address of the database.
     *
     * @returns number
     */
    static getListenPort() {
        const portConfig = process.env.DB_PORT;
        if (portConfig === undefined) {
            console.error("No port set for the database");
        }
        else {
            return parseInt(portConfig);
        }
    }
    /**
     * Method to get the name of the database set.
     *
     * @returns string
     */
    static getDataName() {
        return process.env.DB_DATA;
    }
    /**
     * Method to get the name of the user.
     *
     * @returns string
     */
    static getUsername() {
        return process.env.DB_USER;
    }
    /**
     * Method to get the password.
     *
     * @returns string
     */
    static getPassword() {
        return process.env.DB_PASS;
    }
    /**
     * Method to get the hostname.
     *
     * @returns string
     */
    static getHost() {
        return process.env.DB_HOST;
    }
}
exports.default = DatabaseConfig;
