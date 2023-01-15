module.exports.addDays = function (date, days){
    const ans = new Date();
    ans.setDate(date.getDate()+days);
    return ans;
}