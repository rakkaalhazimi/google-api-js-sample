import { google } from 'googleapis';
import * as fs from 'fs';



fs.readFileSync('auth.json');
let buffer = fs.readFileSync('auth.json');
let auth = JSON.parse(buffer.toString());

const oauth2Client = new google.auth.OAuth2(
  auth.GOOGLE_CLIENT_ID,
  auth.GOOGLE_CLIENT_SECRET,
);

oauth2Client.setCredentials({refresh_token: auth.GOOGLE_REFRESH_TOKEN});
let {token} = await oauth2Client.getAccessToken();
// console.log(token);

let oauth2 = await google.oauth2({version: "v2"})
let user = await oauth2.userinfo.get(
  {}, 
  {headers: {Authorization: "Bearer " + token}}
)
console.log(user);


// Get user from google people
  // let googlePeople = await google.people("v1").people;
  // let people = await googlePeople.get(
  //   {resourceName: "people/me"}, 
  //   {headers: {Authorization: "Bearer " + '<your access token>'}}
  // );
  // console.log(people);