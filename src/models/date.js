import { isValid, isPast } from 'date-fns';
import { upperCaseFirst } from './strings.js';

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

let lookupDictionary = (dictionary, upperBound, minLetters) => {};

let createDay = (value) => {
    let normalized = value,
        finalIndex = -1;

    const ERROR_MESSAGE =
        'Error: a day must be either a value from 1 to 7, a string with no abbreviations or three letters format.';

    if (typeof value === 'number' && value >= 1 && value <= 7) {
        finalIndex = normalized - 1;
    } else if (typeof value === 'string') {
        if (value.length > 3) {
            normalized = upperCaseFirst(normalized);

            finalIndex = Days.indexOf(normalized);
            if (finalIndex !== -1) {
                //Day is valid
            } else {
                //Day is NOT valid
                throw ERROR_MESSAGE;
            }
        } else if (value.length === 3) {
            normalized = upperCaseFirst(normalized);
            Days.forEach((day, index) => {
                if (day.startsWith(normalized)) {
                    finalIndex = index;
                }
            });

            if (finalIndex === -1) {
                //String was not a valid day
                throw ERROR_MESSAGE;
            }
        } else {
            //Invalid length for the string
            throw ERROR_MESSAGE;
        }
    } else {
        //NOT a string and NOT a number
        throw ERROR_MESSAGE;
    }

    return {
        type: 'day',
        value: Days[finalIndex],
    };
};

let createMonth = (value) => {
    let newValue = value;

    if (typeof value === 'number' && value >= 1 && value <= 12) {
        //All good
    } else {
        throw 'Error: a month must be a value from 1 to 12.';
    }
};

let createDate = (type, value) => {};

//Dates
//
//Type: day/month/numday+month/day+month+year
//Value: X
