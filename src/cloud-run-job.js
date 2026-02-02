import { JobsClient, ExecutionsClient } from '@google-cloud/run';
import { google } from 'googleapis';
import * as fs from 'fs';


let buffer = fs.readFileSync('service.account.security.json');
let auth = JSON.parse(buffer.toString());

const client = new JobsClient({credentials: auth});
const executionClient = new ExecutionsClient({ credentials: auth });


async function main() {
  const jobName = `your jobName`;
  const [operation] = await client.runJob({name: jobName});
  
  console.log('Operation metadata: ');
  console.log(operation.metadata);
  
}

main()