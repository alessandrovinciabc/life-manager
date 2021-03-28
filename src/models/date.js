import { upperCaseFirst, lookupDictionary } from './strings.js';

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
        let dateObj, timeToAdd, native, finalNative;

        native = new Date();

        let getTimeToAdd = (dateToCheck, type) => {
            let n, today, maxValue, dictionary, difference, output;

            switch (type) {
                case 'day':
                    maxValue = 7;
                    dictionary = Days;
                    today = native.getDay();
                    today = today === 0 ? maxValue : today;
                    break;
                case 'month':
                    maxValue = 12;
                    dictionary = Months;
                    today = native.getMonth() + 1;
                    break;
                default:
                    throw 'Invalid type for date object.';
                    break;
            }
            n = lookupDictionary(dateToCheck.value, dictionary, 3) + 1;

            difference = n - today;

            if (difference === 0) {
                output = maxValue;
            } else if (difference < 0) {
                output = maxValue + difference;
            } else if (difference > 0) {
                output = difference;
            }

            return output;
        };

        switch (date.type) {
            case 'day':
                timeToAdd = getTimeToAdd(date, 'day');

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
                timeToAdd = getTimeToAdd(date, 'month');

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
                let primitiveDate, primitiveNative;

                let convertedMonth;
                convertedMonth = lookupDictionary(date.value.month, Months, 3);
                //Months are not saved as numbers in fulldate objects

                dateObj = new Date(
                    native.getFullYear(),
                    convertedMonth,
                    date.value.day
                );

                primitiveDate = dateObj.getTime();
                primitiveNative = native.getTime();

                if (primitiveDate <= primitiveNative) {
                    timeToAdd = 1;
                    finalNative = new Date(primitiveDate);
                    finalNative.setFullYear(native.getFullYear() + timeToAdd);
                } else if (primitiveDate > primitiveNative) {
                    finalNative = new Date(primitiveDate);
                }

                result = createDate(
                    'full',
                    finalNative.getDate(),
                    finalNative.getMonth() + 1,
                    finalNative.getFullYear()
                );

                break;
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

let getDay = (obj, wantString = false) => {
    let isValid,
        result = -1,
        native,
        year,
        month,
        day;

    isValid = isDateValid(obj);

    if (isValid) {
        switch (obj.type) {
            case 'daymonth':
                let convertedToFull;

                convertedToFull = getNextOccurrence(obj);
                ({ year, month, day } = convertedToFull);
                month = lookupDictionary(month, Months, 3);
                native = new Date(year, month, day);
                break;

            case 'full':
                ({ year, month, day } = obj.value);
                month = lookupDictionary(month, Months, 3);
                native = new Date(year, month, day);
                break;

            case 'default':
                throw 'Invalid date type for getDay.';
                break;
        }

        let convertedDay;
        convertedDay = native.getDay();
        convertedDay = convertedDay === 0 ? 7 : convertedDay;
        convertedDay -= 1;

        if (wantString) {
            result = Days[convertedDay];
        } else {
            result = convertedDay + 1;
        }
    }

    return result;
};

//TODO
let isBefore = (date, against) => {
    //is date before 'against' ?
};

let isAfter = (date, against) => {};

//                              CALENDARS
let createCalendar = () => {
    let newCalendar;

    newCalendar = new Map();
    let generateMonth = (month, year) => {
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
        } else if (monthN === 1) {
            //February - 29 is a valid day here
            maxForADay = 29;
        } else {
            //The max value for a day becomes 28 here
            maxForADay = 28;
        }

        newCalendarMonth = new Map();
        for (let i = 1; i <= maxForADay; ++i) {
            newCalendarMonth.set(i, createDate('full', i, monthN + 1, year));
        }

        return newCalendarMonth;
    };

    let generateYear = (year) => {
        let newCalendarYear;

        if (typeof year === 'number' && year >= 0) {
            //All good
        } else {
            throw 'Invalid year provided.';
        }

        newCalendarYear = new Map();
        for (let i = 1; i <= 12; ++i) {
            newCalendarYear.set(i, generateMonth(i, year));
        }

        return newCalendarYear;
    };
};

export {
    createDate,
    isDateValid,
    getToday,
    areEqual,
    isToday,
    getNextOccurrence,
    getDay,
};

//Dates
//
//Type: day/month/numday+month/day+month+year
//day, month and daymonth types are always recurring
//Value: X

//todo: 29th of feb. should be valid for daymonth types
