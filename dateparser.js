const LATER = 'LATER'
const WEEKEND = 'WEEKEND'
const TONIGHT = 'TONIGHT'
const TOMORROW = 'TOMORROW'
const NEXT_WEEK = 'NEXT_WEEK'
const NEXT_MONTH = 'NEXT_MONTH'
const NEXT_QUARTER = 'NEXT_QUARTER'
const NEXT_YEAR = 'NEXT_YEAR'

const DEFAULT_HOUR = 8
const TONIGHT_TIME = 20

const DAYS = 'days'
const WEEKDAY = 'weekday'
const MONTH = 'month'
const QUARTER = 'quarter'
const WEEKS = 'weeks'
const MONTHS = 'months'
const YEARS =  'years'
const HOUR = 'hour'
const TIMEZONE = 'timezone'
const AM_PM = ['am', 'pm', 'a.m.', 'p.m.', 'a.m', 'p.m', 'am.', 'pm.']
const ORDINALS = ['st', 'nd', 'rd', 'th']
const SEPARATORS = ['/', '-', '\\', '–']

const GLOSSARY = require('./glossary.json');

/* Return the next weekday after the input date
Args:
    date (Date): base date
    weekday (int): 0 for Sunday, 1 for Monday, ..., 6 for Saturday
Returns:
    Date: next weekday after the input date
*/
function nextWeekday(date, weekday) {
    let daysAhead = weekday - date.getDay();
    if (daysAhead < 0) { // Target day already happened this week
        daysAhead += 7;
    }
    let result = new Date(date);
    result.setDate(result.getDate() + daysAhead);
    return result;
}

function findPosInGlossary(text, kind, locale="en-us") {
    let language = locale.slice(0,2)
    let phrase = text.split(" ");
    let kindWords = GLOSSARY[language].filter(x => x.type === kind).map(x => x.target);
    
    for (let size = 3; size > 0; size--) {
        const formattedPhrase = [];
        for (let i = 0; i < phrase.length - size + 1; i++) {
            formattedPhrase.push(phrase.slice(i, i + size).join(" "));
        }

        for (let i = 0; i < formattedPhrase.length; i++) {
            const word = formattedPhrase[i];
            if (kindWords.includes(word)) {
                return i;
            }
        }
    }
    return null;

}

function wordsToDatepart(text, locale='en-us', filter = null) {
    let language = locale.slice(0,2);
    let glossary = GLOSSARY[language];
    if (filter !== null) {
        glossary = glossary.filter(x => filter.includes(x.type));
    }
    
    let items = glossary.filter(x => x.target.startsWith(text))

    let words = items.map(x => x.target);
    
    // first ask if input text is exactly like one of the words in the glossary
    if (items.some(x => x.target === text)) {
        return items.find(x => x.target === text);
    }
    // then ask if there is at least one word that starts with input text (if text is at least 3 characters long)
    else if (items.some(x => x.target.startsWith(text) && text.length >= 3)) {
        // get all of the words that start with input text
        items = items.filter(x => x.target.startsWith(text));

        // slice items to remove the word and make a set of it, so if there are two or more words that start with input text
        // and the result of those words is the same (i.e. they mean the same concept), it returns the first one
        // EXAMPLE: tomor for tomorrow and tomorow
        if (new Set(items.map(x => x.value)).size === 1) {
            return items[0];
        }
    }
    return null;
}

const moment = require('moment-timezone');

function getTimezone(text) {
    // at least 3 characters, if not returns null
    if (text !== null && text.length >= 3) {
        text = text.replace(' ', '_');
        let timezones = moment.tz.names().filter(tz => tz.toLowerCase().includes(text.toLowerCase()));

        // if all timezones have the same offset, return the first timezone
        let now = moment();
        let offsets = timezones.map(tz => now.tz(tz).format('Z'));
        let uniqueOffsets = [...new Set(offsets)];
        if (uniqueOffsets.length === 1) {
            return timezones[0];
        }
    }
    return null;
}

function canBeYear(year, baseDate) {
    if (typeof year === 'string') {
        if (!isNaN(year)) {
            year = parseInt(year);
        } else {
            return false;
        }
    }
    if (year < 100) {
        year = year + 2000;
    }
    return year >= baseDate.getFullYear() && year <= baseDate.getFullYear() + 10;
}

function canBeMonth(month) {
    if (typeof month === 'string') {
        if (!isNaN(month)) {
            month = parseInt(month);
        } else {
            return null;
        }
    }
    return month < 13;
}

function canBeDay(day) {
    if (typeof day === 'string') {
        if (!isNaN(day)) {
            day = parseInt(day);
        } else {
            return null;
        }
    }
    return day < 32;
}

function canBeHour(hour) {
    if (typeof hour === 'string') {
        if (!isNaN(hour)) {
            hour = parseInt(hour);
        } else {
            return false;
        }
    }
    return hour < 24;
}

function canBeMinute(minute) {
    if (typeof minute === 'string') {
        if (!isNaN(minute)) {
            minute = parseInt(minute);
        } else {
            return false;
        }
    }
    return minute < 60;
}

function getDayAndMonthPositionInLocaleDate(locale) {
    // Crear una fecha de prueba
    const testDate = new Date(2000, 10, 15); // Nov 15th 2000

    // Convertir la fecha de prueba a una cadena de fecha local
    const localeDateString = testDate.toLocaleDateString(locale);

    // Crear una matriz de las partes de la fecha
    const dateParts = localeDateString.split('/');

    // Determinar la posición del día y del mes en la matriz de partes de la fecha
    const dayPosition = dateParts.indexOf(testDate.getDate().toString());
    const monthPosition = dateParts.indexOf((testDate.getMonth() + 1).toString());
    
    return { dayPosition, monthPosition };
}

function getTime(word) {
    let hour = null;
    let minute = null;
    let second = null;

    
    // find colon or am/pm in the word
    if (word.includes(':') || AM_PM.some(x => word.includes(x))) {
        let time = word.split(":");
        
        let amPm = null;
        let lastPart = time.slice(-1)[0];
        console.log("lastPart", lastPart, "time", time, "word", word)
        for (let i = 0; i < lastPart.length; i++) {
            if (isNaN(lastPart[i])) {
                console.log("lastPart[i]", lastPart[i], "i", i, "lastPart", lastPart)
                time[time.length - 1] = lastPart.slice(0, i);
                amPm = word.slice(i);
                break;
            }
        }
        
        let pm = false;
        if (amPm !== null && amPm.includes('p')) {
            pm = true;
        }
        
        time = time.map(x => parseInt(x))
        if (time.length === 1) {
            hour = time[0];
        } else if (time.length === 2) {
            [hour, minute] = time;
        } else if (time.length === 3) {
            [hour, minute, second] = time;
        }

        hour = pm && hour < 12 ? hour + 12 : hour;
    }
    return [hour, minute, second];
}

function parse({text, locale, baseDate=null, localeTimezone=null}) {
    
    if (localeTimezone == null) {
        let testDate = new Date();
        let timezoneOffsetInHours = -testDate.getTimezoneOffset() / 60;
        let offsetString = timezoneOffsetInHours >= 0 ? '+' : '-';
        offsetString += String(Math.abs(timezoneOffsetInHours)).padStart(2, '0') + ':00';
    }
    if (baseDate == null) {
        baseDate = new Date();
    }

    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    if (!locale) {
        locale = window.navigator.language;
    }

    language = locale.slice(0,2);

    words = text.split(" ");

    results = []
    
    let timezone = null
    let years = 0
    let months = 0
    let days = 0
    let hours = 0
    let minutes = 0
    let weeks = 0
    let quarters = 0

    let special = null
    let year = null
    let month = null
    let dayNumber = null
    let weekday = null
    let hour = null
    let minute = null
    let second = null
    let quarter = null
    
    let {dayPosition: dayPos, monthPosition: monthPos} = getDayAndMonthPositionInLocaleDate(locale);

    // ### FIND RELATIVE ###
    let start = null;
    start = findPosInGlossary(text, 'in', locale)
    
    if (start !== null) {
        // in_phrase is the maximum length for an in phrase (i.e. "in 2 days and an hour", 6 words)
        let inPhrase = words.slice(start, start + 6);
        // replace "a" and "an" with 1
        // replace "one" with 1, "two" with 2 ... "fifteen" with 15
        for (let i = 0; i < inPhrase.length; i++) {
            let result = wordsToDatepart(inPhrase[i], locale, ["number"]);
            if (result !== null) {
                inPhrase[i] = String(result.value);
            }
        }
        let relatives = {};
    
        // tries to find relative period words and assign previous word as value
        // i.e. "in 2 days and 3 hours" -> {'days': 2, 'hours': 3}
        for (let i = 0; i < inPhrase.length; i++) {
            let result = wordsToDatepart(inPhrase[i], locale, ["relative"]);
            if (result !== null) {
                relatives[result.value] = inPhrase[i - 1];
            }
        }
        
        // after getting relative values it assigns them to the corresponding variable
        hours = 'hours' in relatives ? parseInt(relatives.hours) : 0;
        minutes = 'minutes' in relatives ? parseInt(relatives.minutes) : 0;
        years = 'years' in relatives ? parseInt(relatives.years) : 0;
        months = 'months' in relatives ? parseInt(relatives.months) : 0;
        days = 'days' in relatives ? parseInt(relatives.days) : 0;
        weeks = 'weeks' in relatives ? parseInt(relatives.weeks) : 0;
        quarters = 'quarters' in relatives ? parseInt(relatives.quarters) : 0;
        weeks = 'fortnights' in relatives ? parseInt(relatives.fortnights) * 2 : weeks;
    
        if (hours === 0 && minutes === 0) {
            hour = DEFAULT_HOUR;
        } else {
            hour = baseDate.getHours();
            if (minutes > 0) {
                minute = baseDate.getMinutes();
            }
        }
    } else {
        // start looking for 3 words phrases, then 2 words phrases and finally 1 word
        for (let size = 3; size > 0; size--) {
            // stop looking at len(words) - size, so if there are 10 words you can only look up to 8th word for a 3 words prhase
            for (let i = 0; i < words.length - size + 1; i++) {
                let word = words.slice(i, i + size).join(' ');
                // conditional to avoid looking for erased words
                if (words[i] !== null) {
                    let result = wordsToDatepart(word, language);
                    
                    if (result !== null) {
                        results.push(result);
                        // set words to None so they aren't considered again
                        words.fill(null, i, i + size);
                    } else {
                        // FIND TIMEZONE ONLY AT THE END
                        if (i === words.length - size) {
                            let tz = getTimezone(word);
                            if (tz) {
                                timezone = tz;
                                words.fill(null, i, i + size);
                            }
                        }
                    }
                }
            }
            // remove empty words (erased words because they are part of a phrase)
            words = words.filter(value => value !== null);
        }

        for (let r of results) {
            if (r.type === 'special') {
                if (special === null) {
                    special = r.value;
                } else {
                    return null;
                }
            } else if (r.type === DAYS) { // TODO: it's not used or replace TOMORROW with this
                if (days === 0) {
                    days = r.value;
                } else {
                    return null;
                }
            } else if (r.type === WEEKDAY) {
                weekday = r.value;
            } else if (r.type === MONTH) {
                month = r.value;
            } else if (r.type === QUARTER) {
                quarter = r.value;
            } else if (r.type === WEEKS) { // TODO: not used. Check if can replace NEXT WEEK with this, 
                weeks = r.value;
                weekday = 0;
                hour = DEFAULT_HOUR;
                minute = 0;
                second = 0;
            } else if (r.type === MONTHS) { // TODO: not used. Check if can replace NEXT MONTH with this, 
                months = r.value;
                day_number = 1;
                hour = DEFAULT_HOUR;
                minute = 0;
                second = 0;
            } else if (r.type === YEARS) {// TODO: not used. Check if can replace NEXT YEAR with this, 
                years = r.value;
                month = 1;
                day_number = 1;
                hour = DEFAULT_HOUR;
                minute = 0;
                second = 0;
            } else if (r.type === HOUR) {
                hour = r.value;
            } else if (r.type === TIMEZONE) {
                timezone = r.value;
            }
        }

        // check if am or pm is separated from the time. If it is, join them
        for (let i = 1; i < words.length; i++) {
            if (AM_PM.includes(words[i])) {
                words[i - 1] = words[i - 1] + words[i];
                words[i] = null;
            }
        }

        // remove empty words (erased am/pm)
        words = words.filter(value => value !== null);

        // FIND DATE PARTS THAT HAVE NUMBER IN THEM
        // i.e. 1st, 3rd, 5th for day, time separated by colon, dates separated by slashes or dashes
        // time in military format or quarter like q1, q2, q3, q4
        for (let pos = 0; pos < words.length; pos++) {
            let word = words[pos];

            // FIND DAY WITH ORDINALS
            // 1st = day 1, 5th = day 5, 31st = day 31
            if (!isNaN(word[0]) && ORDINALS.includes(word.slice(-2))) {
                let number = word.slice(0, -2);
                try {
                    dayNumber = parseInt(number);
                    continue;
                } catch (error) {
                    return null;
                }
            }
            // FIND HOUR with semicolon, am or pm
            // 1:00 = 1 am, 1:14pm = 13:15, 1:00a.m. = 1 am, 1:00p.m. = 1 pm
            let [newHour, newMinute, newSecond] = getTime(word);
            
            if (newHour !== null) {
                hour = newHour;
            }
            if (newMinute !== null) {
                minute = newMinute;
            }
            if (newSecond !== null) {
                second = newSecond;
            }

            // FIND YEAR
            // uses canBeYear function (if word is 4 digits and is between this year and this year + 10)
            // 2024 = year 2024
            if (word.length === 4 && !isNaN(word)) {
                let maybeYear = parseInt(word);
                if (canBeYear(maybeYear, baseDate)) {
                    year = maybeYear;
                    continue;
                }
            }

            // FIND HOUR MILITARY FORMAT
            // 0830 = 08:30, 1600 = 16:00
            if (word.length === 4 && !isNaN(word)) {
                hour = parseInt(word.slice(0, 2));
                minute = parseInt(word.slice(2));
                if (!canBeHour(hour) || !canBeMinute(minute)) {
                    return null;
                }
                continue;
            }

            // FIND QUARTER
            // if starts with "q" and then a number between 1 and 4
            if (word[0] === 'q' && !isNaN(word.slice(1))) {
                quarter = parseInt(word.slice(1));
                if (quarter > 4 || quarter < 1) {
                    return null;
                }
                continue;
            }

            // FIND DATE SEPARATED BY DASH OR SLASH
            let separator = null;
            for (let char of word) {
                if (SEPARATORS.includes(char)) {
                    separator = char;
                    break;
                }
            }
            
            if (separator !== null) {
                let dateArray = word.split(separator);
                
                let yearIsIn = null;
                let monthIsIn = null;
                let dayIsIn = null;
            
                // year is at the beginning and it has 4 digits
                if (dateArray[0].length === 4 && !isNaN(dateArray[0])) {
                    yearIsIn = 0;
                    if (dateArray.length === 3) {
                        monthIsIn = 1;
                        dayIsIn = 2;
                    }
                }
                // year is at the end (it could be a two part or three part date) and it has 4 digits
                else if (dateArray[dateArray.length - 1].length === 4 && !isNaN(dateArray[dateArray.length - 1])) {
                    yearIsIn = dateArray.length - 1;
                }
            
                // GET MONTH IF IT IS NOT DIGIT
                for (let i = 0; i < dateArray.length; i++) {
                    if (isNaN(dateArray[i])) {
                        monthIsIn = i;
                        break;
                    }
                }
            
                // GET THE MONTH IF IS A TWO-PART ARRAY AND ALREADY HAVE YEAR
                if (monthIsIn === null && yearIsIn !== null && dateArray.length === 2) {
                    monthIsIn = [0, 1].find(x => x !== yearIsIn);
                }
            
                // GET DAY IF IT IS A 3-PART DATE AND ALREADY HAVE YEAR AND MONTH
                if (monthIsIn !== null && yearIsIn !== null && dateArray.length === 3) {
                    dayIsIn = [0, 1, 2].find(x => x !== yearIsIn && x !== monthIsIn);
                }
            
                // Until here I get these options in a complete form:
                // two parts date: yyyy-mm or mm-yyyy
                // three parts date: yyyy and month in a string format, day by discarding
            
                // if I still miss a param it could be that I got only the year or only the month
                if ((yearIsIn !== null ? 1 : 0) + (monthIsIn !== null ? 1 : 0) + (dayIsIn !== null ? 1 : 0) < dateArray.length) {

                    // If I know the month could be Nov-24 (month and day or month and year) or 05-Nov-24 (or any other combination of 3 parts)
                    if (monthIsIn !== null) {

                        // if it is a two-parts date the other part is the day if it is less than 32
                        // this could be an ambiguity: Nov-24 could be 24th of November or 2024-11-01, I assume it is 24th of November
                        // but Nov-33 it is 2033-11-01
                        if (dateArray.length === 2) {
                            // get the other value that is not month
                            let value = dateArray[1 - monthIsIn];
                            if (!isNaN(value)) {
                                value = parseInt(value);
                                if (value < 32) {
                                    dayIsIn = 1 - monthIsIn;
                                } else {
                                    value = value + 2000;
                                    if (value >= baseDate.getFullYear() && value <= baseDate.getFullYear() + 10) {
                                        yearIsIn = i;
                                    }
                                }
                            }
                        } else {
                            // if it is a three-parts date, I have to see which of the others could be a year. If it is not a year the other could be the day
                            for (let i = 0; i < dateArray.length; i++) {
                                if (i !== monthIsIn && !isNaN(dateArray[i])) {
                                    let part = parseInt(dateArray[i]);
                                    if (yearIsIn === null && canBeYear(part, baseDate)) {
                                        yearIsIn = i;
                                    } else {
                                        if (canBeDay(part)) {
                                            dayIsIn = i;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        
                        if (dateArray.length === 2) {
                            let canHaveMonth = !isNaN(dateArray[0]) && (canBeMonth(dateArray[0]) || canBeMonth(dateArray[1]));
                        
                            if (canHaveMonth) {
                                // if the two can be months, the two can be days so I use locale
                                if (canBeMonth(dateArray[0]) && canBeMonth(dateArray[1])) {
                                    if (monthPos === 0) {
                                        monthIsIn = 0;
                                        dayIsIn = 1;
                                    } else {
                                        monthIsIn = 1;
                                        dayIsIn = 0;
                                    }
                                // first is month, second is day or year
                                } else if (canBeMonth(dateArray[0])) {
                                    monthIsIn = 0;
                                    if (canBeDay(dateArray[1])) {
                                        dayIsIn = 1;
                                    } else if (canBeYear(dateArray[1])) {
                                        yearIsIn = 1;
                                    }
                                // second is month, first is day or year
                                } else {
                                    monthIsIn = 1;
                                    if (canBeDay(dateArray[0])) {
                                        dayIsIn = 0;
                                    } else if (canBeYear(dateArray[0])) {
                                        yearIsIn = 0;
                                    }
                                }
                            }
                        // if I have 3 parts I just check positions according to locale
                        } else if (dateArray.length === 3) {
                            if (canBeMonth(dateArray[monthPos]) && canBeDay(dateArray[dayPos])) {
                                monthIsIn = monthPos;
                                dayIsIn = dayPos;
                                yearIsIn = [0, 1, 2].filter(i => i !== monthPos && i !== dayPos)[0];
                            }
                        }
                    }
                }

                year = yearIsIn !== null ? parseInt(dateArray[yearIsIn]) : null;
                year = year !== null && year < 2000 ? year + 2000 : year;

                month = monthIsIn !== null ? dateArray[monthIsIn] : null;
                if (month !== null) {
                    if (!isNaN(month)) {
                        month = parseInt(month);
                    } else {
                        month = wordsToDatepart(month, locale, filter=['month']).value;
                    }
                }

                dayNumber = dayIsIn !== null ? parseInt(dateArray[dayIsIn]) : null;
                continue
                
            }

            // FIND JUST NUMBERS THAT COULD BE DAY, MONTH, YEAR, HOUR OR MINUTE
            if (!isNaN(word)) {
                let number = parseInt(word);
                if (monthPos === 0) {
                    if (month === null && canBeMonth(number)) {
                        month = number;
                        continue;
                    }
                } else if (dayNumber === null && canBeDay(number)) {
                    dayNumber = number;
                    continue;
                }

                if (monthPos === 1) {
                    if (month === null && canBeMonth(number)) {
                        month = number;
                        continue;
                    }
                } else if (dayNumber === null && canBeDay(number)) {
                    dayNumber = number;
                    continue;
                }

                // year as 4 digits was already processed, so 2 digits is only possibility
                // 2 digit year only makes sense if you have month and month is before year, 
                //   i.e "06 24" (June 2024) but not "24 06" nor "35 06" (24 and 35 can't represent year)
                // day_number + year is nos natural i.e. "15 24"
                // 32 to represent "year 2032" doesn't make sense neither
                if (year === null && canBeYear(number, baseDate) && month !== null) {
                    year = number + 2000;
                    continue;
                }
                if (hour === null && canBeHour(number)) {
                    hour = number;
                    continue;
                }
                if (minute === null && canBeMinute(number)) {
                    // if hour is nothing but previous is day_number, previous represents hour not day_number
                    // i.e. "17 40", 17 could be day (first option), but 40 can only be minute, so 17 is hour
                    // "17 24" also means hour and minute because day_number and year without month doesn't make sense
                    // in "25 26" 25 only could be day (not hour) so 26 can't be minute
                    if (hour === null && dayNumber !== null && !isNaN(words[pos-1]) && parseInt(words[pos-1]) === dayNumber && canBeHour(dayNumber)) {
                        hour = dayNumber;
                        dayNumber = null;
                    }

                    if (hour !== null) {
                        minute = number;
                    }

                    continue;
                }
            }
            
        }
    }
    console.log("timezone", timezone, "\nyears", years, "\nmonths", months, "\ndays", days, "\nhours", hours, "\nminutes", minutes, "\nweeks", weeks, "\nquarters", quarters)
    console.log("special", special, "\nyear", year, "\nmonth", month, "\ndayNumber", dayNumber, "\nweekday", weekday, "\nhour", hour, "\nminute", minute, "\nsecond", second, "\nquarter", quarter)
    return futureDatetime({baseDate: baseDate, special: special, days: days, weekday: weekday, 
        dayNumber: dayNumber, month: month, year: year, hour: hour, minute: minute, second: second,
        weeks: weeks, years: years, months: months, quarter: quarter, timezone: timezone, 
        hours: hours, minutes: minutes, quarters: quarters});
}

function futureDatetime({weekday = null, weeks = 0, dayNumber = null, days = 0, month = null, months = 0, 
    year = null, years = 0, hour = null, hours = 0, minute = null, minutes = 0, second = null, seconds = 0, 
    quarter = null, timezone = null, special = null, baseDate = null, quarters = 0} = {}) {

    // if it is a special day it doesn't consider any other information about date
    
    // if it has relative days, it doesn't consider any other information about date

    // if it is not special nor relative, calculation will be different depending on
    // whether there is a weekday or not.
    
    // WEEKDAY: If there is only a weekday it looks for the next weekday, but if you have another date unit
    // (day, month, year), you have to check the period when all conditions get satisfied
    // i.e. if you ask for Monday 3rd January 2024, it returns 3rd January 2024 if it is Monday

    // NO WEEKDAY: If there is no weekday, it looks for the first date that satisfies the conditions
    // The logic for the absent date parts depends on whether there is a greater date part
    // if there is a greater date part it is the first value
    // i.e. you have year but not day_number nor month, day_number and month are 1st of January
    // i.e. you have month but not day_number, day_number is 1st of that month
    // if there is not a greater date part is current value (base_date value)
    // or the next one if current value of the lesser date parts is before base_date
    // i.e. if it is 10th of January and you ask for 15th (without month or year), it is 15th of January
    // but if it is 20th of January and you ask for 15th it is 15th of February
    // idem for months and years, if it is July and you ask for October without year will be same year
    // but if you as for March will be March next year

    // check if there is nothing to calculate, it returns None
    if (weekday === null && weeks === 0 && dayNumber === null && days === 0 && month === null && months === 0
            && year === null && years === 0 && hour === null && hours === 0 && minute === null && minutes === 0
            && second === null && seconds === 0 && quarter === null && quarters === 0 && special === null){
        
        return null; 
    }

    const HOURS_LATER = 4;
    if (baseDate === null){
        baseDate = new Date(); // This will get the current date in JavaScript
    }
    

    let baseWeekday = baseDate.getDay();
    let baseMonth = baseDate.getMonth() + 1; // In JavaScript, months are 0-based
    let baseYear = baseDate.getFullYear();
    
    // if hour is not set in params it is 8 am (DEFAULT_HOUR)
    if (hour === null){
        hour = DEFAULT_HOUR;
    }
    if (minute === null){
        minute = 0;
    }
    if (second === null){
        second = 0;
    }

    // if I have a special value I don't have to calculate anything else
    if (special !== null) {
        if (special === LATER) {
            return new Date(baseDate.setHours(baseDate.getHours() + HOURS_LATER, 0, 0, 0));
        } else if (special === WEEKEND) {
            // if it is weekend (Saturday or Sunday), add two days to current day so it is on a laborable day
            if (baseDate.getDay() === 6 || baseDate.getDay() === 0) {
                baseDate.setDate(baseDate.getDate() + 2);
            }
            // calculate next Saturday
            let result = nextWeekday(baseDate, 6);
            return new Date(result.setHours(hour, minute, second, 0));
        } else if (special === TONIGHT) {
            if (baseDate.getHours() < 20) {
                return new Date(baseDate.setHours(TONIGHT_TIME, 0, 0, 0));
            } else {
                return null;
            }
        } else if (special === TOMORROW) {
            let result = new Date(baseDate.setDate(baseDate.getDate() + 1));
            return new Date(result.setHours(hour, minute, second, 0));
        } else if (special === NEXT_WEEK) {
            // next Monday, if today is Monday next week Monday (today + 7 days)
            let result = baseWeekday !== 1 ? nextWeekday(baseDate, 1) : new Date(baseDate.setDate(baseDate.getDate() + 7));
            return new Date(result.setHours(hour, minute, second, 0));
        } else if (special === NEXT_MONTH) {
            let result = new Date(baseDate.setMonth(baseDate.getMonth() + 1, 1));
            return new Date(result.setHours(hour, minute, second, 0));
        } else if (special === NEXT_QUARTER) {
            // this quarter start date + 3 months
            let result = new Date(baseDate.setMonth(Math.floor(baseMonth / 3) * 3, 1));
            result.setMonth(result.getMonth() + 3);
            return new Date(result.setHours(hour, minute, second, 0));
        } else if (special === NEXT_YEAR) {
            let result = new Date(baseDate.setFullYear(baseDate.getFullYear() + 1, 0, 1));
            return new Date(result.setHours(hour, minute, second, 0));
        }
    }

    // if I have relative quarters I translate it to relative months (get start of this quarter and
    // add quarters * 3)
    if (quarters > 0) {
        months = quarters * 3 - (baseMonth - 1) % 3;
        dayNumber = 1;
    }

    if (years === 0 && months === 0 && days === 0 && hours === 0 && minutes === 0 && seconds === 0 && weeks === 0 && quarters === 0) {
        if (weekday !== null) {
            // only weekday, just look for next weekday
            if (dayNumber === null && month === null && year === null) {
                let result = nextWeekday(new Date(baseDate.setDate(baseDate.getDate() + 1)), weekday);
                return new Date(result.setHours(hour, minute, second, 0));
            }
            // if day number, month and year are present have to check if that date has the same weekday and if it is in the future
            // i.e. 15th January 2024 is Monday, so if you ask for Monday 2024-01-15 it returns that day, but if you as for 
            // Tuesday 2024-01-15 it returns None
            else if (dayNumber !== null && month !== null && year !== null) {
                let result = new Date(year, month - 1, dayNumber, hour, minute, second);
                if (result.getDay() === weekday && result > baseDate) {
                    return result;
                } else {
                    return null;
                }
            }
            // you have day number may be year, may be month, may be neither, but not both year and month
            // i.e. Monday 3rd (get next 3rd that is on Monday)
            // i.e. Monday 3rd January (get next 3rd January that is on Monday, for example 2022 or 2028)
            // i.e. Monday 3rd 2024 (get next day 3rd in 2024 that is on Monday, first Monday 3rd in the year is June)
            // you have to try advancing month by month or year by year until to you find a coincidence
            else if (dayNumber !== null) {
                // initial month is base month or the month you input
                let startMonth = baseMonth;
                if (month !== null) {
                    startMonth = month;
                }
                // initial year is base year or the year you input
                let startYear = baseYear;
                if (year !== null) {
                    startYear = year;
                }
                let tryDate = new Date(startYear, startMonth - 1, dayNumber, hour, minute, second);
                // if the date is before the base date, it has to be the next month (or next year if month is not blank)
                if (tryDate < baseDate) {
                    if (month === null) {
                        tryDate.setMonth(tryDate.getMonth() + 1);
                    } else {
                        tryDate.setFullYear(tryDate.getFullYear() + 1);
                    }
                }
                let stopYear = 99999;
                if (year !== null) {
                    stopYear = year;
                }
                let plusMonths = 0;
                let plusYears = 0;
                // if month is empty try month by month
                if (month === null) {
                    plusMonths = 1;
                } else {
                    // if month is not empty try year by year
                    plusYears = 1;
                }
                // try advancing month or year until you find the weekday or year is ahead of input year            
                while (tryDate.getDay() !== weekday && stopYear >= tryDate.getFullYear()) {
                    tryDate.setMonth(tryDate.getMonth() + plusMonths);
                    tryDate.setFullYear(tryDate.getFullYear() + plusYears);
                }
                if (tryDate.getDay() === weekday) {
                    return tryDate;
                } else {
                    return null;
                }
            }
            // month but not day_number (and may be year)
            else if (month !== null) {
                let startDate = baseDate;
                // if year is empty, could be this year or next year
                if (year === null) {
                    // if month is not current month, it starts on 1st day of that month
                    if (month !== baseMonth) {
                        startDate = new Date(baseYear, month - 1, 1, hour, minute, second);
                        // if year is empty and month is before current month, it has to be same month next year
                        if (startDate < baseDate) {
                            startDate.setFullYear(startDate.getFullYear() + 1);
                        }
                    }
                } else {
                    // if year is present, it starts on 1st day of that month-year
                    startDate = new Date(year, month - 1, 1, hour, minute, second);
                    // if it is current month-year it starts on current day
                    if (startDate.getFullYear() === baseDate.getFullYear()) {
                        if (startDate.getMonth() === baseDate.getMonth()) {
                            startDate = baseDate;
                        }
                    // if it is previous year returns None
                    } else if (startDate.getFullYear() < baseDate.getFullYear()) {
                        return null;
                    }
                }
                let result = nextWeekday(startDate, weekday);
                if (result.getMonth() === month - 1) {
                    return result;
                } else {
                    // it is a weekday after the last weekday in that month, so it looks for the first weekday same month next year
                    if (year === null) {
                        startDate.setDate(1);
                        startDate.setFullYear(startDate.getFullYear() + 1);
                        return nextWeekday(startDate, weekday);
                    // if it is a weekday after the last weekday in that month, and year is present, it returns None
                    } else {
                        return null;
                    }
                }
            }
            // only year
            else if (year !== null) {
                let startDate = baseDate;
                if (year > baseYear) {
                    startDate = new Date(year, 0, 1, hour, minute, second);
                } else if (year < baseYear) {
                    return null;
                } else if (weekday === startDate.getDay() && hour < startDate.getHours()) {
                    startDate.setDate(startDate.getDate() + 1);
                }
                let result = nextWeekday(startDate, weekday);
                if (result.getFullYear() === year) {
                    return result;
                } else {
                    // it is a weekday after last weekday on the year
                    return null;
                }
            }
        }
    

        // ********* weekday is blank *************

        let plusDay = 0;
        let plusMonth = 0;
        let plusYear = 0;
        let dayWasNone = dayNumber === null;
        
        // First I set day, which is in the params, or is base_date day or 1st day of month
        // if I don't have a day_number and I have a greater unit (month, year, quarter) I have to start on 1st day of that unit
        // if I don't have a greater unit, I have to start on current day, or may be tomorrow if hour is before base_hour
        if (dayNumber === null) {
            if (month !== null || quarter !== null || year !== null) {
                dayNumber = 1;
            } else {
                dayNumber = baseDate.getDate();
                // if I add 1 day to day_number, it could be after last_day of month
                // As last_day of month depends on the year (because of leap years)
                // I check that after setting month and year
                if (hour !== null && hour <= baseDate.getHours()) {
                    plusDay = 1;
                }
            }
        }

        // then I set month, which is in the params, or is base_date month or is 1st month of year or quarter
        // if I don't have a month and I have a year I have to start on first month of that year
        // if I don't have a month and I have a quarter, I have to calculate which is the first month of that quarter
        // if I don't have a month nor any greater unit it should be current month, except day_number
        // is before base_day_number, in which case it should be next month
        let monthWasNone = month === null;
        if (month === null) {
            if (quarter !== null) {
                month = (quarter - 1) * 3 + 1;
            } else if (year !== null) {
                month = 1;
            } else {
                month = baseMonth;
                if (dayNumber < baseDate.getDate()) {
                    plusMonth = 1;
                }
            }
        }

        // if I don't have a year it should be current year, EXCEPT:
        // if month is before base_month or month equals base_month and day_number is before base_day_number
        // in that case it should be next year
        let yearWasNone = year === null;
        if (year === null) {
            year = baseYear;
            if ((!monthWasNone || quarter !== null) && (month < baseMonth || (month === baseMonth && dayNumber < baseDate.getDate()))) {
                plusYear = 1;
            }
        }

        if (dayNumber > 31) {
            return null;
        }

        if (month > 12) {
            return null;
        }

        // *** FIX MONTH ****
        // if after adding a month new month is 13 or more, I have to calculate modulo between new month and 12
        // and add years as the integer part between new month divided by 12
        // i.e. month = 11 + plus_month=4, new_month = (11 + 4) % 12 = 3, plus_year = 1

        // as month is 1-based instead of 0-based I have to convert it to 0-based (substract 1) and then back to 1-based (add 1)
        // so I can use the modulo properly
        let newMonth = ((month - 1 + plusMonth) % 12) + 1;
        // as month is 1-based instead of 0-based I have to convert it to 0-based (substract 1) to use // 12 properly to get years to add
        let newYear = year + plusYear + Math.floor((month - 1 + plusMonth) / 12);    

        let firstDayTemp = new Date(newYear, newMonth - 1, 1);
        let maxDay = new Date(newYear, newMonth, 0).getDate();
        
        if (maxDay < dayNumber || (maxDay === dayNumber && new Date(year, month - 1, dayNumber, hour, minute, second) <= baseDate)) {
            while (true) {
                // if day, nor month nor year are present then you add a day
                if (dayWasNone && monthWasNone && yearWasNone) {
                    plusDay = plusDay + 1;
                    firstDayTemp.setDate(firstDayTemp.getDate() + 1);
                    maxDay = new Date(firstDayTemp.getFullYear(), firstDayTemp.getMonth() + 1, 0).getDate();
                }
                // if month is not present you can add a month
                else if (monthWasNone) {
                    plusMonth = plusMonth + 1;
                    firstDayTemp.setMonth(firstDayTemp.getMonth() + 1);
                    maxDay = new Date(firstDayTemp.getFullYear(), firstDayTemp.getMonth() + 1, 0).getDate();
                }
                // if year is not present you can add a year
                else if (yearWasNone) {
                    plusYear = plusYear + 1;
                    firstDayTemp.setFullYear(firstDayTemp.getFullYear() + 1);
                    maxDay = new Date(firstDayTemp.getFullYear(), firstDayTemp.getMonth() + 1, 0).getDate();
                }
        
                if (maxDay >= dayNumber) {
                    break;
                }
            }
        }
        
        dayNumber = dayNumber + plusDay;
        year = year + plusYear + Math.floor((month - 1 + plusMonth) / 12);
        month = ((month - 1 + plusMonth) % 12) + 1;
    
    }
    
    if (year === null) {
        year = baseYear;
    }
    if (month === null) {
        month = baseMonth;
    }
    if (dayNumber === null) {
        dayNumber = baseDate.getDate();
    }
    if (hour === null) {
        hour = baseDate.getHours();
    }
    if (minute === null) {
        minute = baseDate.getMinutes();
    }
    if (second === null) {
        second = baseDate.getSeconds();
    }
    
    
    let result = new Date(year, month - 1, dayNumber, hour, minute, second);
    if (timezone !== null){
        let offset = moment.tz(timezone).utcOffset();
        result = new Date(Date.UTC(year, month - 1, dayNumber, hour, minute, second) + offset * 60 * 1000);
    }
    
    
    // Add the relative time
    result.setFullYear(result.getFullYear() + years);
    result.setMonth(result.getMonth() + months);
    result.setDate(result.getDate() + days + weeks * 7);
    result.setHours(result.getHours() + hours);
    result.setMinutes(result.getMinutes() + minutes);
    result.setSeconds(result.getSeconds() + seconds);
    
    if (result > baseDate) {
        return result;
    } else {
        return null;
    }
}

module.exports = parse;