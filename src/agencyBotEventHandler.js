const fbApi = require('./fbApi');
const db = require('./db');
const util = require('./util');
const naverApi = require('./naverApi');
const questionBotEventHandler = require('./questionBotEventHandler');
const locale = require('./locale');
const globalMessage = require('./message');

const PAGE_ACCESS_TOKEN = 'EAAFqq4oySP8BAD2CY3mzhZCh2FL3k9jePiZA5TlJF3ZBj8USEvmVth1JPYn0LrryEFGTZCfu8zK7aSWG7KZCzA1nEAchp86WlrZAloNKlLDQx37EuYC7xQtqHTpHev7zw9OL2mcDgppsZCiLSqJmOJZCZCSIMccqeyFSnOP3cB6WZAeZCOHqBZCTM1DRa7oXKFvDRCYZD';

exports.PAGE_ACCESS_TOKEN = PAGE_ACCESS_TOKEN;
exports.handlerName = 'AgencyBotEventHandler';
const errorReturn = function (senderPsid, locale) {
    fbApi.sendResponse(senderPsid, globalMessage.errorMessage(locale), PAGE_ACCESS_TOKEN);
};
/**
 * 답변자에게 질문 등록 알리기
 * @param ask
 * @returns {Promise<void>}
 */
exports.notifyAskRegisterToAgency = async function (ask) {
    let agencyList = [];
    if (ask.targetAnswerId) {
        const agency = await db.getAgency(ask.targetAnswerId);
        if (agency && agency.registered) {
            agencyList.push(agency);
        }
    } else {
        agencyList = await db.getAgencyList();
    }
    agencyList.forEach(function (agency) {
        if (agency.registered) {
            fbApi.sendGenericTemplate(agency.psid, '질문이 등록되었습니다.', ask.koQuestion, [
                {
                    type: "postback",
                    title: "답변하기(한글입력)",
                    payload: ask.psid + '@@' + ask.askDate
                },
                {
                    type: "postback",
                    title: "답변하기(영어입력)",
                    payload: ask.psid + '@@' + ask.askDate
                },
                {
                    type: 'postback',
                    title: '원본보기',
                    payload: ask.psid + '@@' + ask.askDate
                }
            ], PAGE_ACCESS_TOKEN);
        }
    })
};

exports.handlePostback = async function (senderPsid, postback) {
    console.log('Agency bot receive postback: ', postback);
    try {
        const title = postback.title;
        if (postback.payload === globalMessage.getStart) {
            console.log('agency bot receives get started event: ', postback.payload);
            let agency = {
                psid: senderPsid,
                lastVisitDate: util.getToday(),
                visitCount: 1,
                answerCount: 0,
                registered: false
            };
            await db.saveAgency(agency);
            fbApi.sendResponse(senderPsid, "질문을 받기 전 등록을 진행합니다.\n발급된 인증코드를 입력해주세요.", PAGE_ACCESS_TOKEN);
        } else if (title === '질문자에게 답변 전달하기') {
            const payload = postback.payload.split("@@");
            const answer = await db.getAnswer(payload[0], payload[1]);
            answer.sendToAsker = true;
            await db.saveAnswer(answer);
            await questionBotEventHandler.notifyAnswerRegisterToAsker(answer);
            fbApi.sendResponse(senderPsid, '답변이 전달되었습니다.', PAGE_ACCESS_TOKEN);
        } else if (title === '다시 답변하기') {
            let payload = postback.payload.split('@@');
            const answer = await db.getAnswer(payload[0], payload[1]);
            const ask = await db.getAsk(answer.askPsid, answer.askDate);
            fbApi.sendGenericTemplate(senderPsid, '답변 언어 선택', null, [
                {
                    type: "postback",
                    title: "답변하기(한글입력)",
                    payload: ask.psid + '@@' + ask.askDate
                },
                {
                    type: "postback",
                    title: "답변하기(영어입력)",
                    payload: ask.psid + '@@' + ask.askDate
                }
            ], PAGE_ACCESS_TOKEN);
        } else {
            const data = postback.payload.split("@@");
            const askPsid = data[0], askDate = data[1];
            const ask = await db.getAsk(askPsid, askDate);
            /*if (title === '질문보기') {
                fbApi.sendResponseWithButton(senderPsid, ask.koQuestion, [
                    {
                        type: "postback",
                        title: "답변하기(한글입력)",
                        payload: ask.psid + '@@' + ask.askDate
                    },
                    {
                        type: "postback",
                        title: "답변하기(영어입력)",
                        payload: ask.psid + '@@' + ask.askDate
                    },
                    {
                        type: 'postback',
                        title: '원본보기',
                        payload: ask.psid + '@@' + ask.askDate
                    }
                ], PAGE_ACCESS_TOKEN);
            } else */
            if (title === '원본보기') {
                fbApi.sendGenericTemplate(senderPsid, '질문 원본', ask.originalQuestion, [
                    {
                        type: "postback",
                        title: "답변하기(한글입력)",
                        payload: ask.psid + '@@' + ask.askDate
                    },
                    {
                        type: "postback",
                        title: "답변하기(영어입력)",
                        payload: ask.psid + '@@' + ask.askDate
                    }
                ], PAGE_ACCESS_TOKEN);
            } else if (title === '답변하기(한글입력)' || title === '답변하기(영어입력)') {
                let agency = await db.getAgency(senderPsid);
                agency.lastAnswerAskPsid = askPsid;
                agency.lastAnswerAskDate = askDate;
                agency.lastAnswerLocal = title === '답변하기(한글입력)' ? locale.ko : locale.us;
                agency.visitCount += 1;
                await db.saveAgency(agency);
                fbApi.sendResponseWithTextQuickReply(senderPsid, "답변을 입력하세요.", [{
                    title: '답변하기 취소',
                    payload: askPsid + '@@' + askDate
                }], PAGE_ACCESS_TOKEN);
            }
        }
    } catch (exception) {
        errorReturn(senderPsid, locale.ko);
        throw exception;
    }

};

exports.handleMessage = async function (senderPsid, message) {
    console.log('Agency bot receive message: ', message);
    try {
        const text = message.text;
        const agency = await db.getAgency(senderPsid);
        if (message.quick_reply) {
            if (text === '답변하기 취소') {
                agency.lastAnswerAskDate = undefined;
                agency.lastAnswerAskPsid = undefined;
                await db.saveAgency(agency);
                fbApi.sendResponse(senderPsid, "취소되었습니다.", PAGE_ACCESS_TOKEN);
            }
        } else {
            if (agency.registered) {
                if (agency.lastAnswerAskPsid && agency.lastAnswerAskDate && agency.lastAnswerLocal) {
                    const ask = await db.getAsk(agency.lastAnswerAskPsid, agency.lastAnswerAskDate);
                    const translatedAnswer = await naverApi.translate(text, agency.lastAnswerLocal, ask.locale);
                    if (translatedAnswer === undefined) {
                        throw 'Naver 번역 불가';
                    }
                    let answer = {
                        psid: senderPsid,
                        answerDate: util.getTodayDate(),
                        askPsid: ask.psid,
                        askDate: ask.askDate,
                        askLocale: ask.locale,
                        koAnswer: text,
                        translatedAnswer: translatedAnswer,
                        sendToAsker: false
                    };

                    agency.answerCount += 1;
                    agency.lastAnswerAskDate = undefined;
                    agency.lastAnswerAskPsid = undefined;
                    agency.lastAnswerLocal = undefined;

                    await db.saveAgency(agency);
                    if (await db.saveAnswer(answer)) {
                        fbApi.sendGenericTemplate(senderPsid, '전달 될 답변입니다.', answer.translatedAnswer, [
                            {
                                type: "postback",
                                title: "질문자에게 답변 전달하기",
                                payload: answer.psid + '@@' + answer.answerDate,
                            },
                            {
                                type: "postback",
                                title: "다시 답변하기",
                                payload: answer.psid + '@@' + answer.answerDate,
                            }
                        ], PAGE_ACCESS_TOKEN);
                    } else {
                        throw 'DB 저장불가';
                    }
                } else {
                    fbApi.sendResponse(senderPsid, '답변할 질문이 지정되지 않았습니다.', PAGE_ACCESS_TOKEN);
                }
            } else {
                const inputCode = text;
                const agencyMaster = await db.getAgencyMaster(inputCode);
                if (agencyMaster) {
                    const agency = await db.getAgency(senderPsid);
                    agency.registered = true;
                    agency.nameEn = agencyMaster.nameEn;
                    agency.nameKo = agencyMaster.nameKo;
                    agency.email = agencyMaster.email;
                    agency.phone = agencyMaster.phone;
                    agency.url = agencyMaster.url;
                    agency.description = agencyMaster.description;
                    await db.saveAgency(agency);
                    fbApi.sendResponse(senderPsid, '질문이 등록되면 알려드립니다.', PAGE_ACCESS_TOKEN);
                } else {
                    fbApi.sendResponse(senderPsid, '인증코드가 정확하지 않습니다.\n재발급을 위해서는 kbeautyconsulting@gmail.com으로 연락주세요.', PAGE_ACCESS_TOKEN);
                }
            }
        }
    } catch (exception) {
        errorReturn(senderPsid, locale.ko);
        throw exception;
    }

};