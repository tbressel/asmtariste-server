//////////////////////////////////////////////////
//////////////     TYPE DEFINITION   /////////////
//////////////////////////////////////////////////
import { NotificationMessages } from '../datas/notifications';


interface JsonResponse {
    res: any,
    statusNumber: number,
    messageKey: string;
    message: string;
    state?: boolean;
}

//////////////////////////////////////////////////
//////////      RESPONSE TREATMENT   /////////////
//////////////////////////////////////////////////
/**
 * 
 * @param res : Contains the response in json format
 * @param statusNumber : Conatins the status number of the response
 * @param messageKey : Contains the key of the message to be displayed
 * @param notificationMessages :Contains the message corresponding to the key
 * @returns 
 */
export function getJsonResponse(res: any, statusNumber :number, messageKey: keyof NotificationMessages,
     notificationMessages: NotificationMessages, state?: boolean): JsonResponse {

    return res.status(statusNumber).json({
        messageKey: messageKey,
        message: notificationMessages[messageKey],
        state: state
    });
}



module.exports = {
    
    getJsonResponse
}