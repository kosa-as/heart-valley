export function getDatePattern(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

export const isJSON = (str) => {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
};

export function msToDate (msec) {
    let datetime = new Date(msec);
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let date = datetime.getDate();
    let hour = datetime.getHours();
    let minute = datetime.getMinutes();
    let second = datetime.getSeconds();
 
    let result1 = year + 
                 '-' + 
                 ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                 '-' + 
                 ((date + 1) < 10 ? '0' + date : date) + 
                 ' ' + 
                 ((hour + 1) < 10 ? '0' + hour : hour) +
                 ':' + 
                 ((minute + 1) < 10 ? '0' + minute : minute) + 
                 ':' + 
                 ((second + 1) < 10 ? '0' + second : second);
 
    let result2 = year + 
                 '-' + 
                 ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                 '-' + 
                 ((date + 1) < 10 ? '0' + date : date);
 
    let result = {
        hasTime: result1,
        withoutTime: result2
    };
 
    return result;
};
