
var dateNow = new Date();
var yearNow = dateNow.getFullYear();
var monthNow = dateNow.getMonth() + 1;
var dayNow = dateNow.getDate();
var hoursNow = dateNow.getHours();
var minutesNow = dateNow.getMinutes();
var yearNowStr = '' + yearNow;
var monthNowStr = monthNow < 10 ? ('0' + monthNow) : ('' + monthNow);
var dayNowStr = dayNow < 10 ? ('0' + dayNow) : ('' + dayNow);
var hoursNowStr = '' + hoursNow;
var minutesNowStr = minutesNow < 10 ? ('0' + minutesNow) : ('' + minutesNow);
//获取当前时间对象
export const A = {
	show(){
		console.log('show')			
	},hide(){
		console.log('hide')
	},getTimeNow() {
    return {
        year: yearNow,
        month: monthNow,
        day: dayNow,
        hour: hoursNow,
        minute: minutesNow,
        yearStr: yearNowStr,
        monthStr: monthNowStr,
        dayStr: dayNowStr,
        hourStr: hoursNowStr,
        minuteStr: minutesNowStr 
    	}
	}
}

