import fs from 'fs';
import pdf from 'pdf-parse';

async function readPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  console.log(data.text);
}

readPdf('/src/imports/Fortune_Telling_Service_Prd_And_Site_Blueprint.pdf').catch(console.error);