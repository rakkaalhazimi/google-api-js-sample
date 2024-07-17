import { google } from 'googleapis';
import * as fs from 'fs';
import { GaxiosError } from 'gaxios'



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
    } catch (error) {
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
        eventId: eventId,
      })
      console.log(events.data);
      let recurrent_rule = events.data.recurrence.length ? events.data.recurrence[0] : null;
      console.log(recurrent_rule);
      // for (let item of events.data.items) {
      // console.log(item);
      // }
    } catch (error) {
      if (error instanceof GaxiosError) {
        console.error(error.response.data);
      }
    }
  }

  // Get Instance Events
  async function getInstanceEvents(recurringId, start) {
    let events = await googleCalendar.events.instances({
      calendarId: 'primary',
      eventId: recurringId,
      timeMin: start
    });
    console.log(events);
  }

  // Get calendars
  async function getCalendar() {
    let calendars = await googleCalendar.calendarList.list({
      maxResults: 10
    });
    console.log(calendars.data.items);
  }

  // Insert event
  async function createEvent(start, end, timezone, meetingCode = null) {
    const calendarEvent = {
      summary: "Test Event added by Node.js",
      description: "This event was created by Node.js",
      start: {
        dateTime: start,
        timeZone: timezone,
      },
      end: {
        dateTime: end,
        timeZone: timezone,
      },
      attendees: [
        { email: "rakkakeren@gmail.com" },
        { email: "tenyom@gmail.com" }
      ],
      // recurrence: ["RRULE:FREQ=WEEKLY"],
      reminders: {
        useDefault: false,
        overrides: [
          // { method: "email", minutes: 24 * 60 },
          // { method: "popup", minutes: 10 },
        ],
      },

      extendedProperties: {
        shared: { name: "rakka" }
      }
    };
    
    // Use existing meeting
    // ref: https://stackoverflow.com/questions/75785196/create-a-google-calendar-event-with-a-specified-google-meet-id-conferencedata-c
    if (meetingCode) {
      calendarEvent.conferenceData = {
        conferenceId: meetingCode,
        entryPoints: [
          {
            entryPointType: "video",
            label: `meet.google.com/${meetingCode}`,
            uri: `https://meet.google.com/${meetingCode}`
          }
        ],
        conferenceSolution: {
          key: {
            type: "hangoutsMeet"
          }
        }
      }
    }
    
    // Generate meeting link on fly
    else {
      calendarEvent.conferenceData = {
        createRequest: {
          requestId: auth.SECRET,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      }
    }

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
  // await listEvents('2024-07-15T00:00:00Z', '2024-07-16T00:00:00Z');
  // await createEvent('2024-07-16T00:00:00Z', '2024-07-16T01:00:00Z', 'Asia/Jakarta', 'vrq-ibgo-xbn');
  // await deleteEvent('ae9smettqcqj2kthj1ppb20hak');
  // await getEvents('3c6feep8mkgejdbcvd2tr7gh3c_R20240109T010000');
  // await getEvents('3c6feep8mkgejdbcvd2tr7gh3c_20240710T010000Z');
  // await getInstanceEvents('3c6feep8mkgejdbcvd2tr7gh3c_R20240109T010000');

}

main();