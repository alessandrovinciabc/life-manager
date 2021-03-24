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

let lookupDictionary = (value, dictionary, minLetters = 0) => {
    let finalIndex = -1;

    if (typeof value === 'number' && value >= 1 && value <= dictionary.length) {
        finalIndex = value - 1;
    } else if (typeof value === 'string') {
        if (value.length > minLetters) {
            finalIndex = Days.indexOf(value);
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

export { upperCaseFirst, lookupDictionary };
