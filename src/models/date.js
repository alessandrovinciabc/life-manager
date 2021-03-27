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

let createFullDate = (day, month, year) => {
    let newObj = createDayMonth(day, month);
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
            //The max value for a day becomes 28 here
            maxForADay = 28;
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

//                              HELPFUL METHODS

let getToday = () => {
    let native, day, month, year;

    native = new Date();
    [day, month, year] = [
        native.getDate(),
        native.getMonth() + 1,
        native.getFullYear(),
    ];

    return createDate('full', day, month, year);
};

let areEqual = (date1, date2) => {
    let areValidDates,
        result = false;

    areValidDates = isDateValid(date1) && isDateValid(date2);

    if (areValidDates && date1.type === date2.type) {
        switch (date1.type) {
            case 'day':
                if (date1.value === date2.value) {
                    result = true;
                }
                break;
            case 'month':
                if (date1.value === date2.value) {
                    result = true;
                }
                break;
            case 'daymonth':
                if (
                    date1.value.day === date2.value.day &&
                    date1.value.month === date2.value.month
                ) {
                    result = true;
                }
                break;
            case 'full':
                if (
                    date1.value.day === date2.value.day &&
                    date1.value.month === date2.value.month &&
                    date1.value.year === date2.value.year
                ) {
                    result = true;
                }
                break;
        }
    }

    return result;
};

let isToday = (date) => {
    let isValid,
        nativeToday,
        today,
        wrapper,
        result = false;

    isValid = isDateValid(date);
    if (isValid) {
        today = getToday();
        nativeToday = new Date();
        switch (date.type) {
            case 'day':
                let converted = nativeToday.getDay();

                converted = converted === 0 ? 7 : converted;
                //In Javascript dates getDay() returns a number from 0 to 6.
                //0 = Sunday 1 = Monday ... 6 = Saturday
                //We just check if the value is 0 and change it, we can keep
                //other numbers as they are as they do not create conflicts.

                wrapper = createDate('day', converted);

                if (wrapper.value === date.value) {
                    result = true;
                }

                break;
            case 'month':
                wrapper = createDate('month', nativeToday.getMonth() + 1);

                if (wrapper.value === date.value) {
                    result = true;
                }

                break;
            case 'daymonth':
                if (
                    today.value.day === date.value.day &&
                    today.value.month === date.value.month
                ) {
                    result = true;
                }

                break;
            case 'full':
                if (areEqual(date, today)) {
                    result = true;
                }

                break;
        }
    }

    return result;
};

let getNextOccurrence = (date) => {
    //returns a full date object of the next occurrence of the specified date object
    let dateIsValid, result;

    dateIsValid = isDateValid(date);

    if (dateIsValid) {
        let dateN, todayN, difference, timeToAdd, native, finalNative;

        native = new Date();
        //todaysDate = native.getDate();
        switch (date.type) {
            case 'day':
                dateN = lookupDictionary(date.value, Days, 3) + 1;

                todayN = native.getDay();
                todayN = todayN === 0 ? 7 : todayN;

                difference = dateN - todayN;

                if (difference === 0) {
                    timeToAdd = 7;
                } else if (difference < 0) {
                    timeToAdd = 7 + difference;
                } else if (difference > 0) {
                    timeToAdd = difference;
                }

                finalNative = new Date();
                finalNative.setDate(native.getDate() + timeToAdd);
                //setDate updates the whole date object if the value provided
                //is outside the range.

                result = createDate(
                    'full',
                    finalNative.getDate(),
                    finalNative.getMonth() + 1,
                    finalNative.getFullYear()
                );
                break;

            case 'month':
                dateN = lookupDictionary(date.value, Months, 3) + 1;

                todayN = native.getMonth() + 1;

                difference = dateN - todayN;

                if (difference === 0) {
                    timeToAdd = 12;
                } else if (difference < 0) {
                    timeToAdd = 12 + difference;
                } else if (difference > 0) {
                    timeToAdd = difference;
                }

                finalNative = new Date();
                finalNative.setMonth(native.getMonth() + timeToAdd);

                result = createDate(
                    'full',
                    1,
                    finalNative.getMonth() + 1,
                    finalNative.getFullYear()
                );

                break;
            case 'daymonth':
            case 'full':
                result = createDate(
                    date.type,
                    date.value.day,
                    date.value.month,
                    date.value.year
                );
                break;
        }
    } else {
        throw 'Invalid date object provided for getNextOccurrence.';
    }

    return result;
};

//TODO
let isBefore = (date, against) => {
    //is date before 'against' ?
    let datesAreValid, result;

    datesAreValid = isValid(date) && isValid(against);

    if (datesAreValid) {
    }
};

let isAfter = (date, against) => {};

export {
    createDate,
    isDateValid,
    getToday,
    areEqual,
    isToday,
    getNextOccurrence,
};

//Dates
//
//Type: day/month/numday+month/day+month+year
//day, month and daymonth types are always recurring
//Value: X

//todo: 29th of feb. should be valid for daymonth types
