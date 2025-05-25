import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const saveFile = (fileData: string, extension: string): string => {
  const fileName = `${uuidv4()}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  // Remove base64 prefix if present
  const base64Data = fileData.replace(/^data:.+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const deleteFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};