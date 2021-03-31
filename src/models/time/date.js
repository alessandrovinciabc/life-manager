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

let _formatCheck = (obj, expectedType) => {
  let sub, objProperties, valueProperties;
  let valueCheck = false;

  sub = []; //properties that value must have
  objProperties = Object.getOwnPropertyNames(obj);
  valueProperties = Object.getOwnPropertyNames(obj.value);

  if (
    objProperties.includes('type') &&
    objProperties.includes('value') &&
    expectedType === obj.type
  ) {
    switch (obj.type) {
      case 'day':
        break;
      case 'month':
        break;
      case 'daymonth':
        sub = ['day', 'month'];
        break;
      case 'full':
        sub = ['day', 'month', 'year'];
        break;
    }

    valueCheck = sub.every((el) => valueProperties.includes(el));
  } else {
    //failed check
  }

  return valueCheck;
};

let isDayValid = (obj) => {
  let indexOfDay,
    isValid = false;

  if (_formatCheck(obj, 'day')) {
    indexOfDay = lookupDictionary(obj.value, Days, 3);
    isValid = indexOfDay === -1 ? false : true;
  }

  return isValid;
};

let isMonthValid = (obj) => {
  let indexOfMonth,
    isValid = false;

  if (_formatCheck(obj, 'month')) {
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

  isValidDayMonthObj = _formatCheck(obj, 'daymonth');

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

  isValidFullDate = _formatCheck(obj, 'full');

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
  let result = false;

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

  return result;
};

export { createDate, isDateValid };
export { Days, Months };

//Dates
//
//Type: day/month/numday+month/day+month+year
//day, month and daymonth types are always recurring
//Value: X
