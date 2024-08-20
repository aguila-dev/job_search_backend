const setTimeForDate = (date: Date, hours: number, minutes: number) => {
  date.setHours(hours, minutes, 0, 0); // Set specific time (e.g., 1 AM or 12:30 AM)
  return date;
};

export const yesterdayDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return setTimeForDate(today, 1, 0);
};

export const dynamicDaysAgo = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() - days);
  return setTimeForDate(today, 1, 0);
};

/**
 * function to convert postedOn to date
 * for example is postedOn is string Today then it will return today's date in MM DD, YYYY format, if it is Yesterday then it will return yesterday's date in MM DD, YYYY format,, if it is 2 Days ago then it will return 2 days ago date in MM DD, YYYY format,, if it is 30+ days ago then it will return exactly a month ago date in MM DD, YYYY format
 */

export const convertPostedOnToDate = (postedOn: string) => {
  postedOn = postedOn?.toLowerCase();
  let postedOnDate = new Date();
  if (postedOn.includes("today")) {
    postedOnDate = setTimeForDate(new Date(), 6, 30);
  } else if (postedOn.includes("yesterday")) {
    postedOnDate = yesterdayDate();
  } else if (postedOn.includes("days ago")) {
    const daysAgo = parseInt(postedOn.split(" ")[1]);
    postedOnDate = dynamicDaysAgo(daysAgo);
  } else {
    postedOnDate = new Date(postedOn);
    postedOnDate = setTimeForDate(postedOnDate, 6, 30);
  }
  return postedOnDate.toISOString();
};

export const covertDateToMmDdYyyy = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const today = convertPostedOnToDate("Posted Today");
const yesterday = convertPostedOnToDate("Posted Yesterday");
console.log("today>>", new Date(today).toDateString());
console.log("yesterday>>", new Date(yesterday).toDateString());
