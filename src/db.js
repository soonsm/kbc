var AWS = require("aws-sdk");
AWS.config.update({
    region: "ap-northeast-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

function get(param) {
    return new Promise((resolve) => {
        docClient.get(param, (err, data) => {
            if (!err) {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data.Item);
            } else {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                resolve();
            }
        });
    });
}

function getList(param) {
    return new Promise((resolve) => {
        docClient.scan(param, (err, data) => {
            if (!err) {
                console.log("Scan succeeded");
                resolve(data.Items);
            } else {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                resolve();
            }
        });
    });
}

function put(param) {
    return new Promise((resolve => {
        docClient.put(param, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2), " data: ", data);
                resolve(false);
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    }));
}

function del(param) {
    return new Promise((resolve => {
        docClient.delete(param, function (err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2), " data: ", data);
                resolve(false);
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    }));
}

/**
 * 질문자 조회
 * @param askerPsid
 * @returns {Promise<*>}
 */
exports.getAsker = async function (askerPsid) {
    return await get({
        TableName: "Questionor",
        Key: {
            "psid": askerPsid
        }
    });
};

/**
 * 질문자 저장
 * @param asker
 * @returns {Promise<*>}
 */
exports.saveAsker = async function (asker) {
    return await put({
        TableName: "Questionor",
        Item: asker
    });
}

/**
 * 질문 조회
 * @param askPsid
 * @param askDate
 * @returns {Promise<*>}
 */
exports.getAsk = async function (askPsid, askDate) {
    return await get({
        TableName: "Question",
        Key: {
            "psid": askPsid,
            "askDate": askDate
        }
    });
};

/**
 * 질문 저장
 * @param ask
 * @returns {Promise<*>}
 */
exports.saveAsk = async function (ask) {
    return await put({
        TableName: "Question",
        Item: ask
    });
}

/**
 * 답변자 리스트 조회
 * @returns {Promise<void>}
 */
exports.getAgencyList = async function () {
    return await getList({
        TableName: "Answerer"
    });
}

/**
 * 답변자 조회
 * @param psid
 * @returns {Promise<*>}
 */
exports.getAgency = async function(psid){
    return await get({
       TableName: "Answerer",
       Key: {
           'psid' : psid
       }
    });
}

/**
 * 답변자 저장
 * @param agency
 * @returns {Promise<*>}
 */
exports.saveAgency = async function(agency){
    return await put({
        TableName: "Answerer",
        Item: agency
    })
}

/**
 * 답변 조회
 * @param psid
 * @param date
 * @returns {Promise<*>}
 */
exports.getAnswer = async function (psid, date) {
    return await get({
        TableName: "Answer",
        Key: {
            "psid": psid,
            "answerDate": date
        }
    });
}

/**
 * 답변 저장
 * @param answer
 * @returns {Promise<*>}
 */
exports.saveAnswer = async function(answer){
    return await put({
        TableName: "Answer",
        Item: answer
    });
}

/**
 * 답변 삭제
 * @param answer
 * @returns {Promise<*>}
 */
exports.deleteAnswer = async function(answer){
    return await del({
        TableName: "Answer",
        Key: {
            "psid": answer.psid,
            "answerDate": answer.answerDate
        }
    })
}

/**
 * AgencyMaster 조회
 * @param code
 * @returns {Promise<*>}
 */
exports.getAgencyMaster = async function (code) {
    return await get({
        TableName: "AgencyMaster",
        Key: {
            "agencyCode": code
        }
    });
}