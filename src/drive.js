import { google } from 'googleapis';
import * as fs from 'fs';
import * as mime from 'node-mime-types';
import * as path from 'path';



fs.readFileSync('auth.json');
let buffer = fs.readFileSync('auth.json');
let auth = JSON.parse(buffer.toString());


async function main() {
  
  const scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"];
  
  // let drive = google.drive({
  //   version: "v3",
  //   auth: google.auth.fromJSON({
  //     type: 'authorized_user',
  //     refresh_token: auth.GOOGLE_REFRESH_TOKEN,
  //     client_id: auth.GOOGLE_CLIENT_ID,
  //     client_secret: auth.GOOGLE_CLIENT_SECRET,
  //   }) 
  // });
  
  const drive = google.drive({
    version: "v3",
    
    auth: new google.auth.GoogleAuth({
      keyFile: 'service.account.security.json',
      scopes: scopes
    })
    
  });
  
  // List files
  // Listing all of your drive will require the following scope: 
  // https://www.googleapis.com/auth/drive
  // else it will list files/folders that created with the API.
  async function listFile() {
    // let query = `mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    
    // Files/Folders that are in root and not in trash
    let query = `'root' in parents and trashed = false`;
    
    let files = await drive.files.list({
      q: query,
    });
    console.log(files.data.files);
  }
  
  // Find folder
  async function findFolder(folderName, folderId = null) {
    let query = 
      `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    if (folderId) {
      query += ` and '${folderId}' in parents`
    }  
    
    let folders = await drive.files.list({
      q: query,
    });
    console.log(folders.data.files);
    for (let folder of folders.data.files) {
      return folder.id;
    }
    return null;
  }
  
  // Create a folder
  async function createFolder(folderName, folderId = null) {
    let fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [folderId]
    };
    
    let folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id' // include folder id in response, use * to return all fields
    });
    // console.log(folder);
    return folder.data.id;
  }
  
  // Create a file
  async function createFile(filePath, folderId = null) {
    let mimeType = mime.default.getMIMEType(filePath);
    // console.log('mime: ', mimeType);
    // console.log('Filepath: ', filePath);
    let stream = fs.createReadStream(filePath);
    
    let fileMetadata = {
      name: path.basename(filePath),
      parents: [folderId],
    };
    let media = {
      mimeType: mimeType,
      body: stream
    };
    let file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });
    // console.log(file);
    return file.data.id;
  }
  
  async function uploadFolder(folderPath, folderId = null) {
    let folderName = path.basename(folderPath);
    // Use existing folder if folderName is found
    let currentFolderId = await findFolder(folderName, folderId);
    if (!currentFolderId) {
      currentFolderId = await createFolder(folderName, folderId);
    }
    
    let fileList = fs.readdirSync(folderPath);
    for (let filename of fileList) {
      let filePath = path.join(folderPath, filename);
      let stat = fs.lstatSync(filePath);
      
      if (stat.isDirectory()) {
        let childFolderPath = path.join(folderPath, filename);
        uploadFolder(childFolderPath, currentFolderId);
        
      } else {
        console.log(`Uploading: '${filePath}' to google drive.`);
        let fileId = await createFile(filePath, currentFolderId);
      }
    }
  }
  
  async function getPermission(fileId) {
    
    let permissions = await drive.permissions.list({
      fileId: fileId
    });
    
    console.log(permissions);
    
    return permissions;
  }
  
  async function getFileSize(fileId) {
    try {
      // let response = await drive.files.get({fileId: fileId, fields: 'size'});
      let response = await drive.files.get({fileId: fileId, fields: 'size,kind,id,name,mimeType,capabilities'});
      console.log(response.data);
      const fileSize = parseInt(response.data?.size ?? 0) / (1024 * 1024 * 1024);
      console.log(fileSize);
    } catch (error) {
      console.log(error);
      console.log(error.status);
      console.log(error.message);
    }
    
    // if (response.result && response.result.size) {
    //   return parseInt(response.result.size); // Parse the size to an integer
    // } else {
    //   console.warn('File size not found for file ID:', fileId);
    //   return null;
    // }
  }
  
  
  async function getFileDuration(fileId) {
    try {
      let response = await drive.files.get({fileId: fileId, fields: 'size,kind,id,name,mimeType,capabilities,videoMediaMetadata'});
      console.log(response.data);
      
      const durationMillis = response.data?.videoMediaMetadata?.durationMillis;
    
      if (durationMillis) {
        const totalSeconds = parseInt(durationMillis) / 1000;
        console.log(`Duration in seconds: ${totalSeconds}s`);
        
        // Optional: Format it to HH:MM:SS
        const formattedDuration = new Date(totalSeconds * 1000).toISOString().substr(11, 8);
        console.log(`Formatted Duration: ${formattedDuration}`);
      } else {
        console.log("This file type doesn't have duration metadata (e.g., it's not a video/audio file or still processing).");
      }
      
    } catch (error) {
      console.log(error);
      console.log(error.status);
      console.log(error.message);
    }
  }
  
  // Your code here
  //
  
  
  // createFile('Notulensi/Lappland-001.wav');
  
  // let folderId = await createFolder('Notulensi');
  // console.log('folder id: ', folderId);
  
  // uploadFolder('Notulensi');
  
  // let folderId = await findFolder('test', null);
  // console.log('folder id: ', folderId);
  
  // findRootFile();
  
  // Get link permissions
  // let linkPrivate = https://drive.google.com/file/d/1CKjTPYIv1S6ym4iVAWzyOYOPLSqUxq05/view?usp=sharing
  // let link = "https://drive.google.com/file/d/1aUbpVXy8y4Rys7iVQhAtSKDPc79jNZBl/view?usp=sharing";
  // getPermission('1AoNaT8zOuzA5F2vxqy64twydTCF5TQoP');
  // getPermission('1aUbpVXy8y4Rys7iVQhAtSKDPc79jNZBl');
  // getFileSize('1aUbpVXy8y4Rys7iVQhAtSKDPc79jNZBl');
  getFileDuration('1UETiBCQ0n0bDcX2pKElckcdjS1xahWZ3');
  // getFileSize('1CKjTPYIv1S6ym4iVAWzyOYOPLSqUxq05');
  
  
}

main();