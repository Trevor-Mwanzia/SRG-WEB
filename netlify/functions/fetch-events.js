
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { CALENDAR_ID, API_KEY } = process.env;
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch events' })
        };
    }
};
