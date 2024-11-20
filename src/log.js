import { Logging } from '@google-cloud/logging';
import { google } from 'googleapis';
import * as fs from 'fs';


fs.readFileSync('auth.json');
let buffer = fs.readFileSync('auth.json');
let auth = JSON.parse(buffer.toString());


const logging = new Logging({
  projectId: auth.GOOGLE_PROJECT_ID,
  auth: new google.auth.GoogleAuth({
    keyFile: 'service.account.json',
    
  })
});


async function main() {
  // Log query language reference 
  // ref: https://cloud.google.com/logging/docs/view/logging-query-language#search_by_time
  let filter = [
    `resource.type="k8s_container"`, 
    'AND',
    `resource.labels.project_id="perceptive-ivy-388603"`, 
    'AND',
    `resource.labels.pod_name="bps-baut-stg-df47674a-7e5c-41e7-afef-f7e122aabbba"`,
    'AND',
    `timestamp >= "2024-10-07T00:00:00"`
  ]
  
  let [entries] = await logging.getEntries({
    maxResults: 10,
    orderBy: 'timestamp desc',
    filter: filter.join(' '),
  });
  
  for (let entry of entries) {
    console.log(entry.metadata.timestamp);
  }
}

main()

