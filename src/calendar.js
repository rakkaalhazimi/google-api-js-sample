import { google } from 'googleapis';
import * as fs from 'fs';
import {GaxiosError} from 'gaxios'



fs.readFileSync('auth.json');
let buffer = fs.readFileSync('auth.json');
let auth = JSON.parse(buffer.toString());

async function main() {
  
  const googleCalendar = google.calendar({
    version: 'v3',
    auth: google.auth.fromJSON({
      type: 'authorized_user',
      refresh_token: auth.GOOGLE_REFRESH_TOKEN,
      client_id: auth.GOOGLE_CLIENT_ID,
      client_secret: auth.GOOGLE_CLIENT_SECRET,
    }),
  });
  
  // List events
  async function listEvents(start, end) {
    try {
      let events = await googleCalendar.events.list({
        calendarId: 'primary',
        // timeMin: new Date().toISOString(),
        maxResults: 10,
        timeMin: start,
        timeMax: end,
        singleEvents: true,
        showDeleted: true,
        orderBy: 'startTime',
      })
      console.log(events.data.items.length);
      for (let item of events.data.items) {
        console.log(item);
      }
    } catch(error) {
      if (error instanceof GaxiosError) {
        console.error(error.response.data);
      }
    }
  }
  
  // Get event
  async function getEvents(eventId) {
    try {
      let events = await googleCalendar.events.get({
        calendarId: 'primary',
        eventId: eventId
      })
      console.log(events.data);
      // for (let item of events.data.items) {
        // console.log(item);
      // }
    } catch(error) {
      if (error instanceof GaxiosError) {
        console.error(error.response.data);
      }
    }
  }
  
  // Get calendars
  async function getCalendar() {
    let calendars = await googleCalendar.calendarList.list({
      maxResults: 10
    });
    console.log(calendars.data.items);
  }
  
  // Insert event
  async function createEvent() {
    const calendarEvent = {
      summary: "Test Event added by Node.js",
      description: "This event was created by Node.js",
      start: {
        dateTime: "2024-06-27T00:00:00Z",
        timeZone: "Asia/Jakarta",
      },
      end: {
        dateTime: "2024-06-27T01:00:00Z",
        timeZone: "Asia/Jakarta",
      },
      attendees: [
        {email: "rakkakeren@gmail.com"}, 
        {email: "tenyom@gmail.com"}
      ],
      recurrence: ["RRULE:FREQ=WEEKLY"],
      reminders: {
        useDefault: false,
        overrides: [
          // { method: "email", minutes: 24 * 60 },
          // { method: "popup", minutes: 10 },
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: auth.SECRET,
          conferenceSolutionKey: {type: 'hangoutsMeet'}},
      },
      extendedProperties: {
        shared: {name: "rakka"}
      }
    };
    
    let result = await googleCalendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      resource: calendarEvent 
    });
    
    console.log(result);
  }
  
  // Delete event
  async function deleteEvent(eventId) {
    let result = await googleCalendar.events.delete({
      calendarId: 'primary',
      eventId: eventId
    });
    console.log(result);
    return result;
  }
  
  // Your code
  // await listEvents('2024-06-28T00:00:00Z', '2024-06-29T00:00:00Z');
  // await createEvent();
  // await deleteEvent('ae9smettqcqj2kthj1ppb20hak');
  // await getEvents('<event-id>');
    
}

main();