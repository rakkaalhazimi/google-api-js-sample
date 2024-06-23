const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?';
const scope = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email';

async function googleAuth() {
  let url = GOOGLE_AUTH_URL + new URLSearchParams({
    redirect_uri: 'http://localhost:3000/api/auth/callback/google',
    client_id: '<Your google client ID>',
    access_type: 'offline',
    response_type: 'code',
    scope: scope,
  })
  
  window.open(url, '_blank').focus();
}