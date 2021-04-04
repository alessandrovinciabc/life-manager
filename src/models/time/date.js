import { upperCaseFirst } from '../strings.js';

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

export { Days, Months };
