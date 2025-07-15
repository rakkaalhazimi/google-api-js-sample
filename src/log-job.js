import { Logging } from '@google-cloud/logging';
import { google } from 'googleapis';
import * as fs from 'fs';


let buffer = fs.readFileSync('service.account.security.json');
let auth = JSON.parse(buffer.toString());

const logging = new Logging({
  projectId: auth.project_id,
  auth: new google.auth.GoogleAuth({
    keyFile: 'service.account.security.json',
    
  })
});


async function main() {
  let timestamp = new Date();
  
  // Log query language reference 
  // ref: https://cloud.google.com/logging/docs/view/logging-query-language#search_by_time
  let filters = [
    `resource.type="cloud_run_job"`,
    `resource.labels.project_id="${auth.project_id}"`,
    `labels."run.googleapis.com/execution_name"="meeting-bot-gmeet-dev-hqvlh"`,
    `timestamp >= "2025-07-09T00:00:00"`
    // `resource.labels.job_name = "meeting-bot-gmeet-dev"`,
    // `resource.labels.location = "asia-southeast1"`,
    // `labels."run.googleapis.com/task_index"="0"`,
  ];
  
  let [entries] = await logging.getEntries({
    maxResults: 10,
    orderBy: 'timestamp desc',
    filter: filters.join(' '),
  });
  
  console.log(`Found ${entries.length} entries`);
  
  for (let entry of entries) {
    console.log(entry.metadata.timestamp);
  }
}

main()

