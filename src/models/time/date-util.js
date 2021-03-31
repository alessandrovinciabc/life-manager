import { Days, Months } from './date.js';
import { createDate, isDateValid } from './date.js';

let lookupDictionary = (value, dictionary, minLetters = 0) => {
  let finalIndex = -1;

  if (typeof value === 'number' && value >= 1 && value <= dictionary.length) {
    finalIndex = value - 1;
  } else if (typeof value === 'string') {
    if (value.length > minLetters) {
      finalIndex = dictionary.indexOf(value);
      if (finalIndex !== -1) {
        //Entry is valid
      } else {
        //Entry is NOT valid
      }
    } else if (value.length === minLetters) {
      dictionary.forEach((entry, index) => {
        if (entry.startsWith(value)) {
          finalIndex = index;
        }
      });

      if (finalIndex === -1) {
        //String was not a valid entry
      }
    } else {
      //Invalid length for the string
    }
  } else {
    //NOT a string and NOT a number
  }

  return finalIndex;
};

let isLeapYear = (year) => {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

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

export {
  lookupDictionary,
  isLeapYear,
  getToday,
  areEqual,
  isToday,
  getNextOccurrence,
  getDay,
};
