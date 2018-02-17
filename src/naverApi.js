const request = require("request");
const locale = require('./locale');
const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
const client_id = "UbG25JpIh_VumrhlxU7r";
const client_secret = 'qGCSIhQwF1';
const languageCodeMap = {};
languageCodeMap[locale.us] = "en";
languageCodeMap[locale.gb] = "en";
languageCodeMap[locale.vn] = "vi";
languageCodeMap[locale.ch] = "zh-CN";
languageCodeMap[locale.tw] = "zh-TW";
languageCodeMap[locale.hk] = "zh-TW";
languageCodeMap[locale.th] = "th";
languageCodeMap[locale.id] = "id";
languageCodeMap[locale.ko] = "ko";

function getNaverLanguageSourceCode(locale) {
    if (locale.startsWith("en_")) {
        return "en";
    } else if (locale.startsWith("vi_")) {
        return "vi";
    } else if (locale.startsWith("th_")) {
        return "th";
    } else if (locale.startsWith("id_")) {
        return "id";
    } else if (locale.startsWith("ko_")) {
        return "ko";
    } else {
        return languageCodeMap[locale];
    }
}

const translate = async function (text, sourceLocale, targetLocal) {
    if(sourceLocale === targetLocal){
        return text;
    }

    var options = {
        url: api_url,
        form: {
            'source': getNaverLanguageSourceCode(sourceLocale),
            'target': getNaverLanguageSourceCode(targetLocal),
            'text': text
        },
        headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
    };

    return await new Promise((resolve) => {
        request.post(options, (error, response, body) => {
            try {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    console.log("한국어로 번역된 질문: " + body.message.result.translatedText);
                    resolve(body.message.result.translatedText);
                } else {
                    console.error("Unable to translate. Response Code:" + body);
                    resolve();
                }
            } catch (exception) {
                console.error("Unexpected error: ", exception);
                resolve();
            }
        });
    });
};

exports.translate = translate;