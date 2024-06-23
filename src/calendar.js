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
  
  // Get events
  try {
    let events = await googleCalendar.events.list({
      calendarId: 'primary',
      // timeMin: new Date().toISOString(),
      maxResults: 10,
      timeMin: '2024-06-18T17:00:00Z',
      timeMax: '2024-06-19T16:59:00Z',
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
      console.error(error.response.data)
    }
  }
  
  // Get calendars
  // let calendars = await googleCalendar.calendarList.list({
  //   maxResults: 10
  // });
  // console.log(calendars.data.items);
  
  // Insert event
  // const calendarEvent = {
  //   summary: "Test Event added by Node.js",
  //   description: "This event was created by Node.js",
  //   start: {
  //     dateTime: "2024-06-19T14:10:00-02:00",
  //     timeZone: "Asia/Jakarta",
  //   },
  //   end: {
  //     dateTime: "2024-06-19T14:30:00-02:00",
  //     timeZone: "Asia/Jakarta",
  //   },
  //   attendees: [
  //     {email: "rakkakeren@gmail.com"}, 
  //     {email: "tenyom@gmail.com"}
  //   ],
  //   reminders: {
  //     useDefault: false,
  //     overrides: [
  //       // { method: "email", minutes: 24 * 60 },
  //       // { method: "popup", minutes: 10 },
  //     ],
  //   },
  //   extendedProperties: {
  //     shared: {name: "rakka"}
  //   }
  // };
  
  // let result = await googleCalendar.events.insert({
  //   calendarId: 'primary',
  //   resource: calendarEvent   
  // })
  
  // console.log(result);
    
}

main();