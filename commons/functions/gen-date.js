module.exports.addDays = function (date, days){
    const ans = new Date();
    ans.setDate(date.getDate()+days);
    return ans;
}

module.exports.generateMonths = function (year){

}

module.exports.generateDays = function (month){

}

module.exports.formatAndTrunc = function (date, truncTo){
    const year = date.getYear();
    const month = date.getMonth()+1
    let ans = year.toString();
    if(truncTo === 'year') return ans;
    return ans+'-'+month.toString().padStart(2,'0');
}