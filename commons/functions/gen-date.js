module.exports.addDays = function (date, days){
    const ans = new Date();
    ans.setDate(date.getDate()+days);
    return ans;
}

module.exports.generateMonthsOfYear = function (refDate){
    const dates = [];
    for(let i=1;i<13;i++) {
      dates.push(new Date(Date.UTC(refDate.getFullYear(), i, 1)));
    }
    return dates;
}

module.exports.generateTruncMonthsOfYear = function (refDate){
    return this.generateMonthsOfYear(refDate).map(elmt => this.formatAndTrunc(elmt, "month"));
}

module.exports.generateDaysOfMonth = function (refDate){
    const month = refDate.getMonth();
    const year = refDate.getFullYear();
    const date = new Date(Date.UTC(year, month, 1));
    const dates = [];

    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
}

module.exports.generateTruncDaysOfMonth = function (refDate){
    return this.generateDaysOfMonth(refDate).map(elmt => this.formatAndTrunc(elmt));
}

module.exports.formatAndTrunc = function (date, truncTo){
    const year = date.getFullYear();
    const month = date.getMonth()+1
    let ans = year.toString();
    if(truncTo === 'year') return ans;
    ans = ans+'-'+month.toString().padStart(2,'0');
    if(truncTo === 'month') return ans;
    ans = ans+'-'+date.getDate().toString().padStart(2,'0');
    return ans;
}