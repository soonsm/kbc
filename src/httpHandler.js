const postHandler = function (eventHandler) {
    return function (req, res) {
        // Parse the request body from the POST
        let body = req.body;
        console.log("postHandler: ", body);
        // Check the webhook event is from a Page subscription
        if (body.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {

                // Get the webhook event. entry.messaging is an array, but
                // will only ever contain one event, so we get index 0
                let webhookEvent = entry.messaging[0];
                console.log(webhookEvent);

                const senderPsid = webhookEvent.sender.id;
                console.log('Sender PSID: ' + senderPsid);

                if (webhookEvent.message) {
                    try{
                        eventHandler.handleMessage(senderPsid, webhookEvent.message);
                    }catch(exception){
                        console.error(`${eventHandler.handlerName} handleMessage exception: ${exception}`);

                    }
                } else if (webhookEvent.postback) {
                    try{
                        eventHandler.handlePostback(senderPsid, webhookEvent.postback);
                    }catch(exception){
                        console.error(`${eventHandler.handlerName} handlePostback exception: ${exception}`);
                    }
                }
            });

            // Return a '200 OK' response to all events
            res.status(200).send('EVENT_RECEIVED');

        } else {
            // Return a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    };
};

const getHandler = function (verifyToken) {
    return function (req, res) {
        // Parse params from the webhook verification request
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        // Check if a token and mode were sent
        if (mode && token) {

            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === verifyToken) {

                // Respond with 200 OK and challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);

            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    };
};

exports.getHandler = getHandler;
exports.postHandler = postHandler;