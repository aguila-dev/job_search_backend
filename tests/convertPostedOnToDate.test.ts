import {
  convertPostedOnToDate,
  yesterdayDate,
  dynamicDaysAgo,
} from "../utils/convertPostedOnToDate";

describe("Date conversion tests", () => {
  const getLocalDateString = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
  };

  test('converts "Posted Today" to today’s date', () => {
    const expected = getLocalDateString(new Date());
    const actual = getLocalDateString(
      new Date(convertPostedOnToDate("Posted Today"))
    );
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });

  test('converts "Posted Yesterday" to yesterday’s date', () => {
    const yesterday = yesterdayDate();
    const expected = getLocalDateString(yesterday);
    const actual = getLocalDateString(
      new Date(convertPostedOnToDate("Posted Yesterday"))
    );
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });

  test('converts "Posted 2 Days Ago" to the date two days ago', () => {
    const expected = getLocalDateString(dynamicDaysAgo(2));
    const actual = getLocalDateString(
      new Date(convertPostedOnToDate("Posted 2 Days Ago"))
    );
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });

  test('converts "Posted 30+ Days Ago" to the date thirty days ago', () => {
    const expected = getLocalDateString(dynamicDaysAgo(30));
    const actual = getLocalDateString(
      new Date(convertPostedOnToDate("Posted 30+ Days Ago"))
    );
    console.log(`Expected: ${expected}, Actual: ${actual}`); // Optional logging
    expect(actual).toBe(expected);
  });
});
