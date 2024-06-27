// import { google } from 'googleapis';
import { SpacesServiceClient } from '@google-apps/meet';
import { auth as googleAuth } from 'google-auth-library';
import * as fs from 'fs';



fs.readFileSync('auth.json');
let buffer = fs.readFileSync('auth.json');
let auth = JSON.parse(buffer.toString());

async function main() {
  
  const meetClient = new SpacesServiceClient({
    authClient: googleAuth.fromJSON({
      type: 'authorized_user',
      refresh_token: auth.GOOGLE_REFRESH_TOKEN,
      client_id: auth.GOOGLE_CLIENT_ID,
      client_secret: auth.GOOGLE_CLIENT_SECRET,
    }), 
  });
  
  async function createMeeting() {
    let request = {};
    let response = await meetClient.createSpace(request);
    console.log(response);
  }
  
  // Your code here
  createMeeting();
  
}

main();