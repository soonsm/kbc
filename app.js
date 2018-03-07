'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json()), // creates express http server
    questionBotEventHandler = require('./src/questionBotEventHandler'),
    agencyBotEventHandler = require('./src/agencyBotEventHandler'),
    httpHandler = require('./src/httpHandler'),
    fbApi = require('./src/fbApi'),
    message = require('./src/message');


const QUESTION_BOT_VERIFY_TOKEN = '2';//"K-BUEATY_CONSULTING-WEBHOOK_ASK_VERIFY_TOKEN";
const AGENCY_BOT_VERIFY_TOKEN = '1';//"K-BUEATY_CONSULTING-WEBHOOK_AGENCY_VERIFY_TOKEN";


app.use(express.static('public'));


//질문자 봇 요청 처리
fbApi.sendStart(message.getStart, questionBotEventHandler.PAGE_ACCESS_TOKEN);
fbApi.sendGreetingSetting(message.greeting.asker, questionBotEventHandler.PAGE_ACCESS_TOKEN);
app.post('/question_bot/webhook', httpHandler.postHandler(questionBotEventHandler));
app.get('/question_bot/webhook', httpHandler.getHandler(QUESTION_BOT_VERIFY_TOKEN));

//답변자 봇 요청 처리
fbApi.sendStart(message.getStart, agencyBotEventHandler.PAGE_ACCESS_TOKEN);
fbApi.sendGreetingSetting(message.greeting.agency, agencyBotEventHandler.PAGE_ACCESS_TOKEN);
app.get('/agency_bot/webhook', httpHandler.getHandler(AGENCY_BOT_VERIFY_TOKEN));
app.post('/agency_bot/webhook', httpHandler.postHandler(agencyBotEventHandler));

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));