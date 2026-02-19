import e from "express";
import fs from "fs";
import cors from 'cors';
import { Encryptor } from 'strong-cryptor';


let buffer = fs.readFileSync('auth.json');
let auth = JSON.parse(buffer.toString());

const app = e();
const port = 3000;
const GOOGLE_OAUTH_URL = 'https://oauth2.googleapis.com/token';


// Allow requests from Vite dev server (http://localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
}));


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api/client-id', (req, res) => {
  res.send(auth.GOOGLE_CLIENT_ID);
})

app.get('/api/auth/callback/google', async (req, res) => {
  console.log('From google auth callback');
  console.log('Method: ', req.method);
  console.log('Query:', req.query);
  
  let code = req.query.code;
  let redirect_url = 'http://' + req.headers.host + '/api/auth/callback/google';
  console.log('Redirect url: ', redirect_url);
  
  let url = GOOGLE_OAUTH_URL + '?' + new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: auth.GOOGLE_CLIENT_ID,
    client_secret: auth.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirect_url
  })
  let authResponse = await fetch(url, { method: 'POST' });
  let authJson = await authResponse.json();
  
  let buffer = fs.readFileSync('auth.json');
  let bufferJson = JSON.parse(buffer.toString());
  
  bufferJson.GOOGLE_REFRESH_TOKEN = authJson.refresh_token;
  fs.writeFileSync('auth.json', JSON.stringify(bufferJson, null, '\n'));
  
  console.log('Auth json: ', authJson);
  res.send('token: ' + authJson.access_token);
})


app.get('/api/auth/google-local-auth-callback', async (req, res) => {
  console.log(req.body);
  res.send('success');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
