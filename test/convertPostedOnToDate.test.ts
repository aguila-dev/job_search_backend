import {
  convertPostedOnToDate,
  yesterdayDate,
  dynamicDaysAgo,
} from '@utils/convertPostedOnToDate';

describe('Date conversion tests', () => {
  test('converts "Posted Today" to today’s date', () => {
    const expected = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const actual = convertPostedOnToDate('Posted Today');
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });

  test('converts "Posted Yesterday" to yesterday’s date', () => {
    const yesterday = yesterdayDate();
    const expected = new Date(yesterday).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const actual = convertPostedOnToDate('Posted Yesterday');
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });

  test('converts "Posted 2 Days Ago" to the date two days ago', () => {
    const expected = new Date(dynamicDaysAgo(2)).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const actual = convertPostedOnToDate('Posted 2 Days Ago');
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });

  test('converts "Posted 30+ Days Ago" to the date thirty days ago', () => {
    const expected = new Date(dynamicDaysAgo(30)).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const actual = convertPostedOnToDate('Posted 30+ Days Ago');
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });
});
