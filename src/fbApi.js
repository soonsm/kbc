const request = require('request');

function send(messageBody, PAGE_ACCESS_TOKEN) {
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": messageBody
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!: ', body)
        } else {
            console.error("Unable to send message:" + body);
        }
    });
}

exports.sendResponseWithButton = function (receiverPsid, text, buttons, PAGE_ACCESS_TOKEN) {
    send({
        "messaging_type": "RESPONSE",
        "recipient": {
            "id": receiverPsid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": text,
                    "buttons": buttons
                }
            }
        }
    }, PAGE_ACCESS_TOKEN);
};

exports.sendMessageTagWithButton = function (receiverPsid, text, buttons, PAGE_ACCESS_TOKEN) {
    send({
        "messaging_type": "MESSAGE_TAG",
        "recipient": {
            "id": receiverPsid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": text,
                    "buttons": buttons
                }
            }
        },
        'tag': 'PAIRING_UPDATE'
    }, PAGE_ACCESS_TOKEN);
}
/*
exports.sendAnswerAlram = function (receiverPsid, answer, ask, PAGE_ACCESS_TOKEN) {
    send({
        "messaging_type": "MESSAGE_TAG",
        "recipient": {
            "id": receiverPsid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "답변이 등록되었습니다. " + ask.originalQuestion,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "답변보기",
                            "payload": answer.psid + '@@' + answer.answerDate
                        }
                    ]
                }
            }
        },
        'tag': 'PAIRING_UPDATE'
    }, PAGE_ACCESS_TOKEN);
}

exports.sendQuestionAlram = function (receiverPsid, ask, PAGE_ACCESS_TOKEN) {
    send({
        "messaging_type": "MESSAGE_TAG",
        "recipient": {
            "id": receiverPsid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "질문이 등록되었습니다.",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "질문보기",
                            "payload": ask.psid + '@@' + ask.askDate
                        }
                    ]
                }
            }
        },
        'tag': 'PAIRING_UPDATE'
    }, PAGE_ACCESS_TOKEN);
}
*/
exports.sendResponse = function (receiverId, response, PAGE_ACCESS_TOKEN) {
    send({
        "messaging_type": "RESPONSE",
        "recipient": {
            "id": receiverId
        },
        "message": {
            "text": response
        }
    }, PAGE_ACCESS_TOKEN);
};

exports.sendResponseWithTextQuickReply = function (receiverId, text, quickReplyList, PAGE_ACCESS_TOKEN) {

    let quickReplies = [];
    quickReplyList.forEach((quickReply) => {
        quickReplies.push({
            'content_type': 'text',
            'title': quickReply.title,
            'payload': quickReply.payload
        });
    });

    send({
        "messaging_type": "RESPONSE",
        "recipient": {
            "id": receiverId
        },
        "message": {
            "text": text,
            'quick_replies': quickReplies
        }
    }, PAGE_ACCESS_TOKEN);
}

exports.getProfile = async function (psid, PAGE_ACCESS_TOKEN) {
    return await new Promise((resolve) => {
        request({
            'uri': 'https://graph.facebook.com/v2.6/' + psid,
            'qs': {
                'fields': 'first_name,last_name,profile_pic,locale,gender',
                'access_token': PAGE_ACCESS_TOKEN
            },
            'method': 'GET'
        }, (err, res, body) => {
            if (!err) {
                resolve(JSON.parse(body));
            } else {
                console.error("Unable to get profile:" + err);
                resolve();
            }
        });
    });
};

exports.sendStart = async function (postbackPayload, PAGE_ACCESS_TOKEN) {
    return await new Promise((resolve) => {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
            "qs": {"access_token": PAGE_ACCESS_TOKEN},
            "method": "POST",
            "json": {
                "get_started": {"payload": postbackPayload}
            }
        }, (err, res, body) => {
            if (!err) {
                console.log('get_started info sent!: ', body)
            } else {
                console.error("Unable to send get_started info:" + body);
            }
        });
    });
};

exports.sendGreetingSetting = async function (greetings, PAGE_ACCESS_TOKEN) {
    return await new Promise((resolve) => {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
            "qs": {"access_token": PAGE_ACCESS_TOKEN},
            "method": "POST",
            "json": {
                'greeting': greetings
            }
        }, (err, res, body) => {
            if (!err) {
                console.log('greeting info sent!: ', body)
            } else {
                console.error("Unable to send greeting info:" + body);
            }
        });
    });
};

exports.sendGenericTemplate = async function (psid, title, subtitle, buttons, PAGE_ACCESS_TOKEN) {
    send({
        "recipient": {
            "id": psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": title,
                            "subtitle": subtitle,
                            "buttons": buttons
                        }
                    ]
                }
            }
        }
    }, PAGE_ACCESS_TOKEN);
};
/*
exports.sendPersistentMenuForAgencyBot = async function (PAGE_ACCESS_TOKEN) {
    return await new Promise((resolve) => {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages/messenger_profile",
            "qs": {"access_token": PAGE_ACCESS_TOKEN},
            "method": "POST",
            "json": {
                'persistent_menu': [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            {
                                "title": "질문하기",
                                "type": "postback",
                                "call_to_actions": [
                                    {
                                        "title": "Pay Bill",
                                        "type": "postback",
                                        "payload": "PAYBILL_PAYLOAD"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }, (err, res, body) => {
            if (!err) {
                console.log('greeting info sent!: ', body)
            } else {
                console.error("Unable to send greeting info:" + body);
            }
        });
    });
};
*/