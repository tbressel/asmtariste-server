

/**
 * 
 * Function return true if max connexion to database is reached
 * 
 * @param dbconnect 
 * @returns boolean
 */
export function isMaxConnectionReached(dbconnect: any): boolean {
    
    // Get stat about connection states
    const allConnections: number = (dbconnect as any)._allConnections.length
    console.log("Nombres de connexions : ", allConnections)
    const connectionsLimit: number = (dbconnect as any).config.connectionLimit
    console.log("Nombre max autorisé : ", connectionsLimit)
   
    // Check if we reached the maximum of connection allowed
    return (allConnections >= connectionsLimit) ? true : false;

}


