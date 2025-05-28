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
  return `/uploads/${fileName}`;
};

export const deleteFile = (filePath: string): boolean => {
  if (!filePath || typeof filePath !== 'string') {
    console.error('Invalid file path provided');
    return false;
  }

  try {
    // Convert relative path to absolute path
    const absolutePath = path.resolve(__dirname, '../../', filePath.startsWith('/') ? filePath.slice(1) : filePath);
    
    // Security check - ensure path is within uploads directory
    if (!absolutePath.startsWith(UPLOAD_DIR)) {
      console.error('Attempted to delete file outside uploads directory');
      return false;
    }

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`Successfully deleted file: ${absolutePath}`);
      return true;
    } else {
      console.warn(`File not found: ${absolutePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};