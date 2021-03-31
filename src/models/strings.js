let upperCaseFirst = (string) => {
  let normalized, returnValue;
  const ERROR_MESSAGE = 'Error: value must be a string with length > 1.';

  if (string.length > 1) {
    normalized = string.toLowerCase();
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);

    returnValue = normalized;
  } else {
    throw ERROR_MESSAGE;
  }

  return returnValue;
};

export { upperCaseFirst };
