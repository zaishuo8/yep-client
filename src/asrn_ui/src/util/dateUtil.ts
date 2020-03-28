const weekList: string[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export interface DateDetail {
    year: number, month: number, day: number, hour: number, minute: number, seconds: number, weekdays: number
}

/**
 * 判断是否是闰年
 * @param {number} year 年
 */
export function isLeapYear(year: number): boolean {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}

/**
 * 获取某一个月的天数
 * @param {number} year 年
 * @param {number} month 月
 */
function getDaysOfMonth(year: number, month: number): number {
    const daysList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return month === 2 && isLeapYear(year) ? 29 : daysList[month - 1];
}

/**
 * 将 Date 转化为年月日时分秒
 * @param date - 需要被转化的日期
 * @return {} - {年月日时分秒星期}
 * */
function splitDate(date: Date): DateDetail {
    const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        seconds = date.getSeconds(),
        weekdays = date.getDay();
    return {year, month, day, hour, minute, seconds, weekdays};
}

/**
 * 个位数的时候前面加 0, 返回字符串
 * */
function fixup(num: number): string {
    if (num < 10){
        return `0${num}`;
    }
    return num.toString();
}

export {
    splitDate, getDaysOfMonth, fixup, weekList
};
