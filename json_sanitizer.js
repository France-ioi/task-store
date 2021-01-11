/**
 * This file contain the structure of the json and the function that allow us to verify if the structure is correct.
 * If you modify the model of the json that is exported, you must modify the model here also
 */

module.exports = {
    sanitizeUserInput: sanitizeUserInput
}

/**
 * This represent the model of the exported subject, it just give the required structure and type of each field to make
 * sure that the type is valid
 * @type {{data: {}, answer: [], gridInfos: {}, taskIntro: string, PEMTaskMetaData: {license: string, language: string, version: string, authors: string}, title: string}}
 */
model = {
    title: "str",
    taskIntro: "str",

    PEMTaskMetaData: {
        authors: "str",
        language: "str",
        version: "str",
        license: "str"
    },

    gridInfos: {},

    data: {},

    answer: []
}

/**
 * This function allow us to sanitize the input of the user. It take the json and verify if it is correct
 * @param inputStr The data that the user sent to the server.
 * @return {Object} The object containing the input of the user, {@code null} if the object given is invalid. It also
 * print a console.error if the input is incorrect.
 */
function sanitizeUserInput(inputStr) {
    if (!inputStr)
        return null;
    let ret = null;
    try {
        ret = JSON.parse(inputStr);
    } catch (e) {
        return null;
    }
    if (testJson(ret, model))
        return ret;
    else
        return null;
}

/**
 * This function allow us to compare two arrays
 * @param arr1 The first array to compare
 * @param arr2 The second array to compare
 * @return {boolean} true if both array are equal, false otherwise.
 */
function arrayEquals(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every(function(str, i) {
        return str === arr2[i];
    })
}

/**
 * This method allow us to verify if the json is of correct type and format everywhere.
 * @param json The json of the user
 * @param toCompare The json with which we have to compare it
 * @return {boolean} true if the comparison is working, false otherwise.
 */
function testJson(json, toCompare) {
    const userKeys = Object.keys(json);
    const toCompareKeys = Object.keys(toCompare);
    if (!arrayEquals(userKeys, toCompareKeys))
        return false;

    for (let i = 0; i < toCompareKeys.length; i++) {
        var currKey = toCompareKeys[i];
        // verify if they are of same type
        if (typeof toCompare[currKey] !== typeof json[currKey])
            return false;

        if (Array.isArray(toCompare[currKey]) && !Array.isArray(json[currKey]))
            return false;

        // if we have an object that has more fields to verify, then we call the function recursively.
        if (typeof toCompare[currKey] === "object" && Object.keys(toCompare[currKey]).length > 0) {
            if (!testJson(json[currKey], toCompare[currKey]))
                return false;
        }
    }
}