/**
 * function to convert postedOn to date
 * for example is postedOn is string Today then it will return today's date in MM DD, YYYY format, if it is Yesterday then it will return yesterday's date in MM DD, YYYY format,, if it is 2 Days ago then it will return 2 days ago date in MM DD, YYYY format,, if it is 30+ days ago then it will return exactly a month ago date in MM DD, YYYY format
 */

function convertPostedOnToDate(postedOn) {
    postedOn = postedOn.toLowerCase();
    const today = new Date();
    let postedOnDate = new Date();
    if (postedOn.includes('today')) {
        postedOnDate = today;
    } else if (postedOn.includes('yesterday')) {
        postedOnDate = new Date(yesterdayDate());
    } else if (postedOn.includes('days ago')) {
        const daysAgo = parseInt(postedOn.split(' ')[1]);
        postedOnDate = new Date(dynamicDaysAgo(daysAgo));
    } else {
        postedOnDate = new Date(postedOn);
    }
    return postedOnDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function yesterdayDate() {
    const today = new Date();
    return today.setDate(today.getDate() - 1);
}
function dynamicDaysAgo(days) {
    const today = new Date();
    return today.setDate(today.getDate() - days);
}


module.exports = {
    convertPostedOnToDate,
    yesterdayDate,
    dynamicDaysAgo,
};
