exports.getToday = function(){
    const dt = new Date();
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    return [year, (month < 10 ? '0' + month : month), day].join('');
};


exports.getTodayDate = function(){
    const dt = new Date();
    const hour = dt.getHours();
    const minutes = dt.getMinutes();
    const seconds = dt.getSeconds();
    let milliseconds = dt.getMilliseconds();
    if(milliseconds < 10){
        milliseconds += '00';
    }else if(milliseconds < 100){
        milliseconds += '0'
    }
    return exports.getToday() + '' + (hour < 10 ? '0' + hour : hour) + '' + (minutes < 10 ? '0' + minutes : minutes) + '' + (seconds < 10 ? '0' + seconds : seconds) + '' + milliseconds;
}