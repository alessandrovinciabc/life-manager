import { createDate } from './date.js';
import { isLeapYear } from './date-util.js';

let createCalendar = () => {
    let newCalendar;

    newCalendar = new Map();
    let _generateMonth = (month, year) => {
        let newCalendarMonth, monthN, maxForADay;

        if (typeof year !== 'number') {
            throw 'Year is not a number.';
        } else if (year < 0) {
            throw 'Year is not a valid number.';
        }

        if (typeof month === 'number' && month >= 1 && month <= 12) {
            monthN = month - 1;
        } else {
            throw 'Invalid value provided.';
        }

        if (monthN % 2 === 0) {
            //31-day month
            maxForADay = 31;
        } else if (monthN === 1) {
            //February - 29 is a valid day here
            if (isLeapYear(year)) {
                maxForADay = 29;
            } else {
                maxForADay = 28;
            }
        } else {
            //The max value for a day becomes 28 here
            maxForADay = 30;
        }

        newCalendarMonth = new Map();
        for (let i = 1; i <= maxForADay; ++i) {
            newCalendarMonth.set(i, {
                date: createDate('full', i, monthN + 1, year),
                contents: [],
            });
        }

        return newCalendarMonth;
    };

    let _generateYear = (year) => {
        let newCalendarYear;

        if (typeof year === 'number' && year >= 0) {
            //All good
        } else {
            throw 'Invalid year provided.';
        }

        newCalendarYear = new Map();
        for (let i = 1; i <= 12; ++i) {
            newCalendarYear.set(i, _generateMonth(i, year));
        }

        return newCalendarYear;
    };

    let addYear = (year) => {
        let result = false;
        if (typeof year === 'number' && year >= 0 && !newCalendar.has(year)) {
            newCalendar.set(year, _generateYear(year));
        }

        return result;
    };

    let getDay = (day, month, year) => {
        return newCalendar.get(year).get(month).get(day);
    };

    return { calendar: newCalendar, addYear, getDay };
};

export { createCalendar };
