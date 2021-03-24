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

let createDate = (type, value) => {
    switch (type) {
        case 'day':
            createDay(value);
            break;
        case 'month':
            createMonth(value);
            break;
    }
};

//Dates
//
//Type: day/month/numday+month/day+month+year
//Value: X
