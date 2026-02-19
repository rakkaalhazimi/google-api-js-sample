const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?';
const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/meetings.space.created'
]
const scope = scopes.join(' ');

  
  
async function googleAuth() {
  const res = await fetch('http://localhost:3000/api/client-id');
  const GOOGLE_CLIENT_ID = await res.text();
  let url = GOOGLE_AUTH_URL + new URLSearchParams({
    redirect_uri: 'http://localhost:3000/api/auth/callback/google',
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    scope: scope,
    prompt: 'consent',
  })
  
  window.open(url, '_blank').focus();
}

const btn = document.getElementById('auth-btn');
btn.addEventListener('click', googleAuth);