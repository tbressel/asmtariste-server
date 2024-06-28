"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonResponse = void 0;
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
function getJsonResponse(res, statusNumber, messageKey, notificationMessages, state) {
    return res.status(statusNumber).json({
        messageKey: messageKey,
        message: notificationMessages[messageKey],
        state: state
    });
}
exports.getJsonResponse = getJsonResponse;
module.exports = {
    getJsonResponse
};
