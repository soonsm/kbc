const fbApi = require('./fbApi');
const db = require('./db');
const naverApi = require('./naverApi');
const agencyBotEventHandler = require('./agencyBotEventHandler');
const util = require('./util');
const locale = require('./locale');
const globalMessage = require('./message');

const PAGE_ACCESS_TOKEN = "EAAFqq4oySP8BAD2CY3mzhZCh2FL3k9jePiZA5TlJF3ZBj8USEvmVth1JPYn0LrryEFGTZCfu8zK7aSWG7KZCzA1nEAchp86WlrZAloNKlLDQx37EuYC7xQtqHTpHev7zw9OL2mcDgppsZCiLSqJmOJZCZCSIMccqeyFSnOP3cB6WZAeZCOHqBZCTM1DRa7oXKFvDRCYZD";
exports.PAGE_ACCESS_TOKEN = PAGE_ACCESS_TOKEN;
exports.handlerName = 'QuestionBotEventHandler';

const errorReturn = function (senderPsid, locale) {
    fbApi.sendResponse(senderPsid, globalMessage.errorMessage(locale), PAGE_ACCESS_TOKEN);
};

exports.handleMessage = async function (senderPsid, message) {
    const text = message.text;
    console.log('Question bot receive message: ', message.text);

    let askerProfile = await fbApi.getProfile(senderPsid, PAGE_ACCESS_TOKEN);
    if (askerProfile === undefined) {
        console.error('Profile을 가져올 수 없습니다.');
        errorReturn(senderPsid, locale.us);
        return;
    }
    console.log("Sender Profile: " + JSON.stringify(askerProfile));
    const askerLocale = askerProfile.locale;
    try {
        if (text === '') {
            fbApi.sendResponse(senderPsid, globalMessage.enterAgain(askerLocale), PAGE_ACCESS_TOKEN);
        } else if (message.quick_reply) {
            if (text === 'English' || text === globalMessage.nativeLanguage(askerLocale)) {
                const askDate = message.quick_reply.payload;
                let ask = await db.getAsk(senderPsid, askDate);
                if (text === "English") {
                    ask.locale = locale.us;
                } else {
                    ask.locale = (await db.getAsker(senderPsid)).locale;
                }
                ask.koQuestion = await naverApi.translate(ask.originalQuestion, ask.locale, "ko_KR");
                if (ask.koQuestion === undefined) {
                    throw 'Naver 번역 불가';
                }
                if (await db.saveAsk(ask)) {
                    await agencyBotEventHandler.notifyAskRegisterToAgency(ask);
                    fbApi.sendResponse(senderPsid, globalMessage.questionRegistered(askerLocale), PAGE_ACCESS_TOKEN);
                } else {
                    throw 'DB 저장 불가';
                }

                const asker = await db.getAsker(senderPsid);
                asker.localeNotSlectedAskDate = undefined;
                await db.saveAsker(asker);

            } else if (text === globalMessage.cancelResponderFix(askerLocale)) {
                const askerPsid = message.quick_reply.payload;
                const asker = await db.getAsker(askerPsid);
                asker.targetAnswerId = null;
                await db.saveAsker(asker);
                fbApi.sendResponse(senderPsid, globalMessage.cancelResponderAck(askerLocale), PAGE_ACCESS_TOKEN);
            }
        } else {
            let asker = await db.getAsker(senderPsid);
            let ask;
            if (!asker) {
                fbApi.sendResponse(senderPsid, globalMessage.wrongAccess(askerLocale), PAGE_ACCESS_TOKEN);
                return;
            }
            //질문 후 언어 선택 안하고 다시 질문했을 때 질문을 덮어쓰기 위해 질문을 가져온다.
            if (asker.localeNotSlectedAskDate) {
                ask = await db.getAsk(senderPsid, asker.localeNotSlectedAskDate);
            }

            let targetAnswerPsid;

            asker.visitCount++;
            asker.askCount++;
            asker.lastVisitDate = util.getToday();
            targetAnswerPsid = asker.targetAnswerPsid;
            asker.targetAnswerPsid = undefined;
            asker.firstName = askerProfile.first_name;
            asker.lastName = askerProfile.last_name;
            asker.gender = askerProfile.gender;
            asker.profilePicUrl = askerProfile.profile_pic;
            asker.locale = askerProfile.locale;
            asker.localeNotSlectedAskDate = util.getTodayDate();

            await db.saveAsker(asker);

            if (!ask) {
                ask = {
                    psid: senderPsid,
                    askDate: asker.localeNotSlectedAskDate
                };
            }
            ask.originalQuestion = text;
            ask.targetAnswerPsid = targetAnswerPsid;
            if (await db.saveAsk(ask)) {
                fbApi.sendResponseWithTextQuickReply(senderPsid, globalMessage.languageSelection(askerLocale), [{
                    title: globalMessage.nativeLanguage(askerLocale),
                    payload: ask.askDate
                }, {title: 'English', payload: ask.askDate}], PAGE_ACCESS_TOKEN);
            } else {
                throw 'DB 저장 불가';
            }
        }
    } catch (exception) {
        errorReturn(senderPsid, askerLocale);
        throw exception;
    }


};

/**
 * 답변보기, 이 답변자에게 다시 질문하기 처리
 * @param senderPsid
 * @param postback
 * @returns {Promise<void>}
 */
exports.handlePostback = async function (senderPsid, postback) {
    console.log('Question bot receive postback: ', postback);
    const title = postback.title;
    const payload = postback.payload;

    let askerProfile = await fbApi.getProfile(senderPsid, PAGE_ACCESS_TOKEN);
    if (askerProfile === undefined) {
        console.error('Profile을 가져올 수 없습니다.');
        errorReturn(senderPsid, locale.us);
        return;
    }
    console.log("Sender Profile: " + JSON.stringify(askerProfile));
    const askerLocale = askerProfile.locale;
    try {
        /*if (title === globalMessage.showAnswer(askerLocale)) {
            const answerData = payload.split("@@");
            const psid = answerData[0];
            const date = answerData[1];

            const answer = await db.getAnswer(psid, date);
            fbApi.sendGenericTemplate(senderPsid, globalMessage.answer(askerLocale), answer.translatedAnswer, [
                {
                    type: "postback",
                    title: globalMessage.askAgain(askerLocale),
                    payload: answer.psid
                }
            ], PAGE_ACCESS_TOKEN);
        } else */
        if (title === globalMessage.askAgain(askerLocale)) {
            const asker = await db.getAsker(senderPsid);
            asker.targetAnswerPsid = payload;
            await db.saveAsker(asker);
            fbApi.sendResponseWithTextQuickReply(senderPsid, globalMessage.enterAsk(askerLocale), [{
                title: globalMessage.cancelResponderFix(askerLocale),
                'payload': senderPsid
            }], PAGE_ACCESS_TOKEN);
        } else if (title === globalMessage.showAgencyInfo(askerLocale)) {
            const agency = await db.getAgency(payload);
            fbApi.sendGenericTemplate(senderPsid, agency.nameEn, agency.description, [
                {
                    type: "web_url",
                    title: globalMessage.visitHompage(askerLocale),
                    url: agency.url
                }
            ], PAGE_ACCESS_TOKEN);
        } else if (payload === globalMessage.getStart) {
            let asker = {
                psid: senderPsid,
                lastVisitDate: util.getToday(),
                visitCount: 0,
                askCount: 0
            };
            asker.visitCount++;
            asker.askCount++;
            asker.lastVisitDate = util.getToday();
            asker.targetAnswerPsid = undefined;
            asker.firstName = askerProfile.first_name;
            asker.lastName = askerProfile.last_name;
            asker.gender = askerProfile.gender;
            asker.profilePicUrl = askerProfile.profile_pic;
            asker.locale = askerProfile.locale;

            await db.saveAsker(asker);

            fbApi.sendResponse(senderPsid, globalMessage.enterAsk(askerLocale), PAGE_ACCESS_TOKEN);
        }
    } catch (exception) {
        errorReturn(senderPsid, askerLocale);
        throw exception;
    }

};

/**
 * 답변이 등록되었음을 질문자에게 알림
 * @param answer
 * @returns {Promise<void>}
 */
exports.notifyAnswerRegisterToAsker = async function (answer) {
    /*
        const ask = await db.getAsk(answer.askPsid, answer.askDate);
        if (ask) {
            const asker = await db.getAsker(answer.askPsid);
            const ask = await db.getAsk(answer.askPsid, answer.askDate);
            fbApi.sendGenericTemplate(asker.psid, globalMessage.answerArrived(asker.locale), '질문\n'+ask.originalQuestion, [
                {
                    type: "postback",
                    title: globalMessage.showAnswer(asker.locale),
                    payload: answer.psid + '@@' + answer.answerDate
                }
            ], PAGE_ACCESS_TOKEN);
        };
    */

    const asker = await db.getAsker(answer.askPsid);
    const agency = await db.getAgency(answer.psid);
    fbApi.sendGenericTemplate(asker.psid, `${globalMessage.answer(asker.locale)}(${agency.nameEn})`, answer.translatedAnswer, [
        {
            type: "postback",
            title: globalMessage.askAgain(asker.locale),
            payload: answer.psid
        },
        {
            type: "postback",
            title: globalMessage.showAgencyInfo(asker.locale),
            payload: answer.psid
        }
    ], PAGE_ACCESS_TOKEN);
};
