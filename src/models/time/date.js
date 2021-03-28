import { upperCaseFirst } from '../strings.js';
import { lookupDictionary, isLeapYear } from './date-util.js';

const Days = [
    'Monday', //0
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday', //6
];
Object.freeze(Days);

const Months = [
    'January', //0
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December', //11
];
Object.freeze(Months);

//                              DATE OBJECTS CREATION
let createDay = (value) => {
    let normalized;
    if (typeof value === 'string') {
        normalized = upperCaseFirst(value);
    } else if (typeof value === 'number') {
        normalized = value;
    }

    let indexOfDay = lookupDictionary(normalized, Days, 3);
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
    let normalized;
    if (typeof value === 'string') {
        normalized = upperCaseFirst(value);
    } else if (typeof value === 'number') {
        normalized = value;
    }

    let indexOfMonth = lookupDictionary(normalized, Months, 3);
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
        maxForADay = 30;
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

let createFullDate = (day, month, year) => {
    let newObj, convertedMonth;
    convertedMonth = lookupDictionary(month, Months, 3) + 1;
    if (convertedMonth === 2 && day === 29 && !isLeapYear(year)) {
        throw 'Error: invalid day provided. Year is not leap.';
    }
    newObj = createDayMonth(day, month);
    newObj.type = 'full';
    newObj.value.year = year;

    return newObj;
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
        case 'full':
            returnValue = createFullDate(values[0], values[1], values[2]);
            break;
        default:
            throw 'Invalid type provided for date creation. day|month|daymonth|full';
            break;
    }

    return returnValue;
};

//                              DATE OBJECTS VALIDATION
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

let isDayMonthValid = (obj) => {
    let month,
        monthIndex,
        maxForADay,
        isValidDay = false,
        isValidDayMonthObj,
        isValidMonth = true;

    isValidDayMonthObj =
        typeof obj === 'object' &&
        obj.hasOwnProperty('type') &&
        obj.type === 'daymonth' &&
        obj.hasOwnProperty('value') &&
        obj.value.hasOwnProperty('day') &&
        obj.value.hasOwnProperty('month');

    if (isValidDayMonthObj) {
        maxForADay = 31;
        month = obj.value.month;
        monthIndex = Months.indexOf(month);

        if (monthIndex === -1) {
            isValidMonth = false;
        } else if (monthIndex % 2 === 0) {
            //31-day month
        } else if (monthIndex === 1) {
            //February - 29 is a valid day here
            maxForADay = 29;
        } else {
            maxForADay = 30;
        }

        isValidDay =
            typeof obj.value.day === 'number' &&
            obj.value.day >= 1 &&
            obj.value.day <= maxForADay;
        if (isValidDay && isValidMonth) {
            //It's a valid DayMonth Object.
        } else {
            isValidDayMonthObj = false;
        }
    }

    return isValidDayMonthObj;
};

let isFullDateValid = (obj) => {
    let isValidFullDate,
        isValidDayMonth = false;

    isValidFullDate =
        typeof obj === 'object' &&
        obj.hasOwnProperty('type') &&
        obj.type === 'full' &&
        obj.hasOwnProperty('value') &&
        obj.value.hasOwnProperty('day') &&
        obj.value.hasOwnProperty('month') &&
        obj.value.hasOwnProperty('year') &&
        typeof obj.value.year === 'number';

    if (
        obj.value.month === 'Febraury' &&
        obj.value.day === 29 &&
        !isLeapYear(obj.value.year)
    ) {
        isValidFullDate = false;
    }

    if (isValidFullDate) {
        isValidDayMonth = isDayMonthValid(
            createDayMonth(obj.value.day, obj.value.month)
        );
    }

    return isValidDayMonth && isValidFullDate;
};

//Combines all other validation functions into one
//This only will be exported
let isDateValid = (obj) => {
    const ValidTypes = ['day', 'month', 'daymonth', 'full'];
    let formatIsValid,
        result = false;

    formatIsValid =
        typeof obj === 'object' &&
        obj.hasOwnProperty('type') &&
        ValidTypes.includes(obj.type) &&
        obj.hasOwnProperty('value');

    if (formatIsValid) {
        switch (obj.type) {
            case 'day':
                result = isDayValid(obj);
                break;
            case 'month':
                result = isMonthValid(obj);
                break;
            case 'daymonth':
                result = isDayMonthValid(obj);
                break;
            case 'full':
                result = isFullDateValid(obj);
                break;
        }
    }

    return result;
};

export { createDate, isDateValid };
export { Days, Months };

//Dates
//
//Type: day/month/numday+month/day+month+year
//day, month and daymonth types are always recurring
//Value: X

//todo: 29th of feb. should be valid for daymonth types
