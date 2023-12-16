/**
 * @jest-environment jsdom
 */

const parse = require('../dateparser');

test('test tomorrow', () => {
    let baseDate = new Date(2023, 10, 8, 11, 33, 0);
    let expectedDate = new Date(2023, 10, 9, 8, 0, 0);
    expect(parse({text: 'tomorrow', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 11, 33, 0);
    expectedDate = new Date(2023, 10, 9, 8, 0, 0);
    expect(parse({text: 'tmrw', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 7, 33, 0);
    expectedDate = new Date(2023, 10, 9, 8, 0, 0);
    expect(parse({text: 'tomor', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 11, 33, 0);
    expectedDate = new Date(2023, 10, 9, 8, 0, 0);
    expect(parse({text: 'mañana', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test tomorrow 10am', () => {
    let baseDate = new Date(2023, 10, 8, 11, 33, 0);
    let expectedDate = new Date(2023, 10, 9, 10, 0, 0);
    expect(parse({text: 'tomorrow 10am', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 11, 33, 0);
    expectedDate = new Date(2023, 10, 9, 10, 0, 0);
    expect(parse({text: 'tomorrow 10 am', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 11, 33, 0);
    expectedDate = new Date(2023, 10, 9, 10, 0, 0);
    expect(parse({text: 'mñn 10a.m.', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test today 11pm', () => {
    let baseDate = new Date(2023, 10, 8, 11, 33, 0);
    let expectedDate = new Date(2023, 10, 8, 23, 0, 0);
    expect(parse({text: 'today 11pm', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 11, 33, 0);
    expectedDate = new Date(2023, 10, 8, 23, 0, 0);
    expect(parse({text: 'today 11 p.m.', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 11, 33, 0);
    expectedDate = new Date(2023, 10, 8, 23, 0, 0);
    expect(parse({text: 'hoy 11p.m.', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test later', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2023, 10, 8, 16, 0, 0);
    expect(parse({text: 'later', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 8, 16, 0, 0);
    expect(parse({text: 'a few hours', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 8, 16, 0, 0);
    expect(parse({text: 'más tarde', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test tonight', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2023, 10, 8, 20, 0, 0);
    expect(parse({text: 'tonight', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 20, 20, 33, 0);
    expect(parse({text: 'tonight', baseDate: baseDate})).toBeNull();

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 8, 20, 0, 0);
    expect(parse({text: 'esta noche', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test weekend', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2023, 10, 11, 8, 0, 0);
    expect(parse({text: 'weekend', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 11, 12, 33, 0);
    expectedDate = new Date(2023, 10, 18, 8, 0, 0);
    expect(parse({text: 'weekend', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 12, 13, 33, 0);
    expectedDate = new Date(2023, 10, 18, 8, 0, 0);
    expect(parse({text: 'fin de sem', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 11, 15, 0, 0);
    expect(parse({text: 'weekend 3pm', baseDate: baseDate})).toEqual(expectedDate);
});

test('test next week', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2023, 10, 13, 8, 0, 0);
    expect(parse({text: 'next week', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 13, 8, 0, 0);
    expect(parse({text: 'proxima semana', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test next month', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2023, 11, 1, 8, 0, 0);
    expect(parse({text: 'next month', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 11, 1, 8, 0, 0);
    expect(parse({text: 'siguiente mes', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test Tuesday', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2023, 10, 14, 8, 0, 0);
    expect(parse({text: 'Tuesday', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 14, 8, 0, 0);
    expect(parse({text: 'on Tuesday', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2023, 10, 14, 8, 0, 0);
    expect(parse({text: 'siguiente martes', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test March', () => {
    let baseDate = new Date(2023, 10, 8, 12, 33, 0);
    let expectedDate = new Date(2024, 2, 1, 8, 0, 0);
    expect(parse({text: 'March', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 12, 33, 0);
    expectedDate = new Date(2024, 2, 1, 8, 0, 0);
    expect(parse({text: 'siguiente marzo', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test next month', () => {
    let baseDate = new Date(2023, 10, 10, 15, 22, 0);
    let expectedDate = new Date(2023, 11, 1, 8, 0, 0);
    expect(parse({text: 'next month', baseDate: baseDate})).toEqual(expectedDate);
});

test('test q2', () => {
    let baseDate = new Date(2023, 8, 10, 15, 22, 0);
    let expectedDate = new Date(2024, 3, 1, 8, 0, 0);
    expect(parse({text: 'q2', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 8, 10, 15, 22, 0);
    expectedDate = new Date(2024, 3, 1, 8, 0, 0);
    expect(parse({text: 'qtwo', baseDate: baseDate})).toEqual(expectedDate);
});

test('test next quarter', () => {
    let baseDate = new Date(2023, 6, 10, 15, 22, 0);
    let expectedDate = new Date(2023, 9, 1, 8, 0, 0);
    expect(parse({text: 'next quarter', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 15, 22, 0);
    expectedDate = new Date(2023, 9, 1, 8, 0, 0);
    expect(parse({text: 'próximo cuatri', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test 2024', () => {
    let baseDate = new Date(2023, 6, 10, 15, 22, 0);
    let expectedDate = new Date(2024, 0, 1, 8, 0, 0);
    expect(parse({text: '2024', baseDate: baseDate})).toEqual(expectedDate);
});

test('test next year', () => {
    let baseDate = new Date(2023, 6, 10, 15, 22, 0);
    let expectedDate = new Date(2024, 0, 1, 8, 0, 0);
    expect(parse({text: 'next year', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 11, 10, 15, 22, 0);
    expectedDate = new Date(2024, 0, 1, 8, 0, 0);
    expect(parse({text: 'año que viene', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test noon', () => {
    let baseDate = new Date(2023, 6, 10, 15, 22, 0);
    let expectedDate = new Date(2023, 6, 11, 12, 0, 0);
    expect(parse({text: 'noon', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 8, 22, 0);
    expectedDate = new Date(2023, 6, 11, 12, 0, 0);
    expect(parse({text: 'tomorrow noon', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 10, 8, 22, 0);
    expectedDate = new Date(2023, 10, 13, 12, 0, 0);
    expect(parse({text: 'Monday noon', baseDate: baseDate})).toEqual(expectedDate);
});

test('test midnight', () => {
    let baseDate = new Date(2023, 6, 10, 15, 22, 0);
    let expectedDate = new Date(2023, 6, 11, 0, 0, 0);
    expect(parse({text: 'midnight', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 8, 22, 0);
    expectedDate = new Date(2023, 6, 11, 0, 0, 0);
    expect(parse({text: 'mañana a la medianoche', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 8, 8, 22, 0);
    expectedDate = new Date(2023, 10, 10, 0, 0, 0);
    expect(parse({text: 'Friday midnight', baseDate: baseDate})).toEqual(expectedDate);
});

test('test morning', () => {
    let baseDate = new Date(2023, 6, 10, 4, 22, 0);
    let expectedDate = new Date(2023, 6, 10, 8, 0, 0);
    expect(parse({text: 'morning', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 8, 22, 0);
    expectedDate = new Date(2023, 6, 11, 8, 0, 0);
    expect(parse({text: 'tomorrow morning', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 6, 8, 22, 0);
    expectedDate = new Date(2023, 10, 9, 8, 0, 0);
    expect(parse({text: 'jueves por la mañana', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);
});

test('test night', () => {
    let baseDate = new Date(2023, 6, 10, 16, 22, 0);
    let expectedDate = new Date(2023, 6, 10, 20, 0, 0);
    expect(parse({text: 'noche', baseDate: baseDate, locale: "es"})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 20, 22, 0);
    expectedDate = new Date(2023, 6, 11, 20, 0, 0);
    expect(parse({text: 'tomorrow night', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 10, 20, 22, 0);
    expectedDate = new Date(2023, 10, 14, 20, 0, 0);
    expect(parse({text: 'Tuesday night', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 16, 22, 0);
    expectedDate = new Date(2023, 6, 10, 20, 0, 0);
    expect(parse({text: 'evening', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 20, 22, 0);
    expectedDate = new Date(2023, 6, 11, 20, 0, 0);
    expect(parse({text: 'tomorrow evening', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 10, 20, 22, 0);
    expectedDate = new Date(2023, 10, 15, 20, 0, 0);
    expect(parse({text: 'Wednesday evening', baseDate: baseDate})).toEqual(expectedDate);
});

test('test just hour', () => {
    let baseDate = new Date(2023, 6, 10, 16, 22, 0);
    let expectedDate = new Date(2023, 6, 11, 5, 0, 0);
    expect(parse({text: '5am', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 16, 22, 0);
    expectedDate = new Date(2023, 6, 10, 17, 0, 0);
    expect(parse({text: '5pm', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 16, 22, 0);
    expectedDate = new Date(2023, 6, 11, 6, 0, 0);
    expect(parse({text: '06am', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 16, 22, 0);
    expectedDate = new Date(2023, 6, 10, 19, 0, 0);
    expect(parse({text: '07pm', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 16, 22, 0);
    expectedDate = new Date(2023, 6, 11, 8, 0, 0);
    expect(parse({text: '8a.m.', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 2, 22, 0);
    expectedDate = new Date(2023, 6, 10, 21, 0, 0);
    expect(parse({text: '9 p.m.', baseDate: baseDate})).toEqual(expectedDate);
});

test('test military hour', () => {
    let baseDate = new Date(2023, 6, 10, 16, 22, 0);
    let expectedDate = new Date(2023, 6, 11, 8, 15, 0);
    expect(parse({text: '0815', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 2, 22, 0);
    expectedDate = new Date(2023, 6, 10, 19, 0, 0);
    expect(parse({text: '1900', baseDate: baseDate})).toEqual(expectedDate);
});

const moment = require('moment-timezone');

test('test hour and timezone', () => {
    let baseDate = new Date(2023, 6, 10, 16, 22, 0);
    let offset = moment.tz("US/Central").utcOffset();
    let expectedDate = new Date(Date.UTC(2023, 6, 11, 5, 0, 0) + offset * 60 * 1000);
    expect(parse({text: '5am CT', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 10, 16, 22, 0);
    offset = moment.tz("America/Argentina/Buenos_Aires").utcOffset();
    expectedDate = new Date(Date.UTC(2023, 6, 11, 5, 0, 0) + offset * 60 * 1000);
    expect(parse({text: '5am Buenos Aires', baseDate: baseDate})).toEqual(expectedDate);
});

test('test just year', () => {
    let baseDate = new Date(2023, 6, 10, 16, 22, 0);
    let expectedDate = new Date(2024, 0, 1, 8, 0, 0);
    expect(parse({text: '2024', baseDate: baseDate})).toEqual(expectedDate);
});

test('test day and month', () => {
    let baseDate = new Date(2023, 6, 10, 16, 22, 0);
    let expectedDate = new Date(2024, 3, 1, 8, 0, 0);
    expect(parse({text: '1st April', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 1, 10, 16, 22, 0);
    expectedDate = new Date(2023, 4, 2, 8, 0, 0);
    expect(parse({text: '02 May', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 5, 1, 16, 22, 0);
    expectedDate = new Date(2023, 5, 3, 8, 0, 0);
    expect(parse({text: '03rd Jun', baseDate: baseDate})).toEqual(expectedDate);
});

test('test leap day', () => {
    let baseDate = new Date(2024, 6, 1, 16, 22, 0);
    let expectedDate = new Date(2028, 1, 29, 8, 0, 0);
    expect(parse({text: '29th Feb', baseDate: baseDate})).toEqual(expectedDate);
});

test('test day month year', () => {
    let baseDate = new Date(2023, 5, 1, 16, 22, 0);
    let expectedDate = new Date(2023, 6, 4, 8, 0, 0);
    expect(parse({text: '4th July 2023', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 5, 1, 16, 22, 0);
    expectedDate = new Date(2024, 7, 5, 8, 0, 0);
    expect(parse({text: '05th Augu 2024', baseDate: baseDate})).toEqual(expectedDate);
});

test('test day and month separated by slash dash or hyphen', () => {
    let baseDate = new Date(2023, 6, 1, 16, 22);
    let expectedDate = new Date(2023, 9, 7, 8);
    expect(parse({text: '7-Oct', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2023, 10, 8, 8);
    expect(parse({text: '08/Nove', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2023, 8, 12, 8);
    expect(parse({text: '9-12', baseDate: baseDate, locale: 'en-US'})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2023, 11, 9, 8);
    expect(parse({text: '9-12', baseDate: baseDate, locale: 'en-GB'})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2023, 9, 1, 8);
    expect(parse({text: '10/01', baseDate: baseDate, locale: 'en-US'})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2024, 0, 10, 8);
    expect(parse({text: '10/01', baseDate: baseDate, locale: 'en-GB'})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2024, 1, 11, 8);
    expect(parse({text: '11\\Feb', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2024, 3, 12, 8);
    expect(parse({text: '12–April', baseDate: baseDate})).toEqual(expectedDate);
});

test('test day month year separated by slash dash or hyphen', () => {
    let baseDate = new Date(2023, 6, 1, 16, 22);
    let expectedDate = new Date(2024, 4, 13, 8);
    expect(parse({text: '13-May-2024', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2024, 5, 14, 8);
    expect(parse({text: '14/Jun/24', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2032, 5, 15, 8);
    expect(parse({text: '06\\15\\2032', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2033, 6, 16, 8);
    expect(parse({text: '16–7–2033', baseDate: baseDate, locale: 'en-GB'})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2024, 7, 5, 8);
    expect(parse({text: '2024-08-05', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 6, 1, 16, 22);
    expectedDate = new Date(2023, 8, 6, 8);
    expect(parse({text: '2023-9-6', baseDate: baseDate})).toEqual(expectedDate);
});

test('test in days', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2023, 10, 21, 8);
    expect(parse({text: 'in 5 days', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 9);
    expectedDate = new Date(2023, 10, 21, 12);
    expect(parse({text: 'in 5 days and 3 hours', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 9);
    expectedDate = new Date(2023, 10, 17, 16);
    expect(parse({text: 'en 1 día y 7 horas', baseDate: baseDate, locale: 'es-ar'})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 9, 55);
    expectedDate = new Date(2023, 10, 18, 10, 5);
    expect(parse({text: 'in 2 days and 10 minutes', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 9);
    expectedDate = new Date(2023, 10, 17, 8);
    expect(parse({text: 'in a day', baseDate: baseDate})).toEqual(expectedDate);
});

test('test in months', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2024, 4, 16, 8);
    expect(parse({text: 'in 6 months', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2024, 4, 20, 8);
    expect(parse({text: 'in 6 months and 4 days', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 11, 16, 8);
    expect(parse({text: 'en un mes', baseDate: baseDate, locale: 'es-ar'})).toEqual(expectedDate);
});

test('test in weeks', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2023, 11, 14, 8);
    expect(parse({text: 'in 4 weeks', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 11, 16, 8);
    expect(parse({text: 'in 4 weeks and 2 days', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 10, 23, 8);
    expect(parse({text: 'in a week', baseDate: baseDate})).toEqual(expectedDate);
});

test('test in years', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2025, 10, 16, 8);
    expect(parse({text: 'in 2 years', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2024, 10, 16, 8);
    expect(parse({text: 'in a year', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2026, 10, 16, 8);
    expect(parse({text: 'in three years', baseDate: baseDate})).toEqual(expectedDate);
});

test('test in quarters', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2024, 6, 1, 8);
    expect(parse({text: 'in 3 quarters', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2024, 0, 1, 8);
    expect(parse({text: 'en un trimestre', baseDate: baseDate, locale: 'es'})).toEqual(expectedDate);
});

test('test in fortnights', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2023, 11, 28, 8);
    expect(parse({text: 'in 3 fortnights', baseDate: baseDate})).toEqual(expectedDate);
});

test('test in hours', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2023, 10, 16, 13);
    expect(parse({text: 'in 8 hours', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 10, 16, 13, 5);
    expect(parse({text: 'in 8 hours and 5 minutes', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 10, 16, 15);
    expect(parse({text: 'in 10 hrs', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 10, 16, 6);
    expect(parse({text: 'in an hour', baseDate: baseDate})).toEqual(expectedDate);
});

test('test in minutes', () => {
    let baseDate = new Date(2023, 10, 16, 5, 17);
    let expectedDate = new Date(2023, 10, 16, 5, 26);
    expect(parse({text: 'in 9 mins', baseDate: baseDate})).toEqual(expectedDate);
});

test('test numbers', () => {
    let baseDate = new Date(2023, 10, 16, 5);
    let expectedDate = new Date(2023, 10, 24, 8);
    expect(parse({text: '24', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 5);
    expectedDate = new Date(2023, 10, 16, 17, 40);
    expect(parse({text: '17 40', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 16, 16, 15);
    expectedDate = new Date(2023, 10, 17, 8, 25);
    expect(parse({text: '8 25', baseDate: baseDate, locale: 'en-GB'})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 17, 11);
    expectedDate = new Date(2031, 8, 6, 8);
    expect(parse({text: '6 Septem 2031', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 17, 11);
    expectedDate = new Date(2024, 4, 6, 8);
    expect(parse({text: '05 06 2024', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 17, 11);
    expectedDate = new Date(2024, 5, 5, 8);
    expect(parse({text: '05 06 2024', baseDate: baseDate, locale: 'en-GB'})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 17, 11);
    expectedDate = new Date(2024, 4, 6, 8);
    expect(parse({text: '05 06 24', baseDate: baseDate})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 17, 11);
    expectedDate = new Date(2024, 5, 5, 8);
    expect(parse({text: '05 06 24', baseDate: baseDate, locale: 'en-GB'})).toEqual(expectedDate);

    baseDate = new Date(2023, 10, 18, 7);
    expectedDate = new Date(2024, 1, 19, 12, 30);
    expect(parse({text: '02 19 2024 12:30', baseDate: baseDate})).toEqual(expectedDate);
});