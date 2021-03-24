import { isValid, isPast } from 'date-fns';
import { upperCaseFirst, lookupDictionary } from './strings.js';

const Days = [
    'Monday', //0
    'Tuesday',
    'Thursday',
    'Wednesday',
    'Friday',
    'Saturday',
    'Sunday', //6
];
Object.freeze(Days);

const Months = [
    'January', //0
    'Febraury',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November', //11
];
Object.freeze(Months);

let isDayValid = (obj) => {
    let indexOfDay,
        isValid = false;

    if (
        obj.hasOwnProperty('type') &&
        obj.type === 'day' &&
        obj.hasOwnProperty('value')
    ) {
        indexOfDay = lookupDictionary(obj.value, Days, 3);
        isValid = indexOfDay === -1 ? false : true;
    }

    return isValid;
};

let isMonthValid = (obj) => {
    let indexOfMonth,
        isValid = false;

    if (
        obj.hasOwnProperty('type') &&
        obj.type === 'month' &&
        obj.hasOwnProperty('value')
    ) {
        indexOfMonth = lookupDictionary(obj.value, Months, 3);
        isValid = indexOfMonth === -1 ? false : true;
    }

    return isValid;
};

let isDayMonthValid = (obj) => {};

let createDay = (value) => {
    let indexOfDay = lookupDictionary(upperCaseFirst(value), Days, 3);
    const ERROR_MESSAGE = `Error: value is not a valid day.`;

    if (indexOfDay === -1) {
        //Error
        throw ERROR_MESSAGE;
    }

    return {
        type: 'day',
        value: Days[indexOfDay],
    };
};

let createMonth = (value) => {
    let indexOfMonth = lookupDictionary(upperCaseFirst(value), Months, 3);
    const ERROR_MESSAGE = `Error: value is not a valid month.`;

    if (indexOfMonth === -1) {
        //Error
        throw ERROR_MESSAGE;
    }

    return {
        type: 'month',
        value: Months[indexOfMonth],
    };
};

let createDayMonth = (day, month) => {
    let newDay, newMonth, monthIndex, maxForADay, dayIsValid;

    maxForADay = 31;
    newMonth = createMonth(month).value;
    monthIndex = Months.indexOf(newMonth);

    if (monthIndex % 2 === 0) {
        //31-day month
    } else if (monthIndex === 1) {
        //February - 29 is a valid day here
        maxForADay = 29;
    } else {
        //The max value for a day becomes 28 here
        maxForADay = 28;
    }

    dayIsValid = typeof day === 'number' && day >= 1 && day <= maxForADay;

    if (dayIsValid) {
        newDay = day;
    } else {
        throw 'Error: invalid day provided.';
    }

    return {
        type: 'daymonth',
        value: {
            day: newDay,
            month: newMonth,
        },
    };
};

let createDate = (type, ...values) => {
    let returnValue;
    switch (type) {
        case 'day':
            returnValue = createDay(values[0]);
            break;
        case 'month':
            returnValue = createMonth(values[0]);
            break;
        case 'daymonth':
            returnValue = createDayMonth(values[0], values[1]);
            break;
    }

    return returnValue;
};

//Dates
//
//Type: day/month/numday+month/day+month+year
//day, month and daymonth types are always recurring
//Value: X

//todo: 29th of feb. should be valid for daymonth types
