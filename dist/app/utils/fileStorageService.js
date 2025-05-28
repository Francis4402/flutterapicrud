"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.saveFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads');
// Ensure upload directory exists
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const saveFile = (fileData, extension) => {
    const fileName = `${(0, uuid_1.v4)()}.${extension}`;
    const filePath = path_1.default.join(UPLOAD_DIR, fileName);
    // Remove base64 prefix if present
    const base64Data = fileData.replace(/^data:.+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs_1.default.writeFileSync(filePath, buffer);
    return `/uploads/${fileName}`;
};
exports.saveFile = saveFile;
const deleteFile = (filePath) => {
    if (!filePath || typeof filePath !== 'string') {
        console.error('Invalid file path provided');
        return false;
    }
    try {
        // Convert relative path to absolute path
        const absolutePath = path_1.default.resolve(__dirname, '../../', filePath.startsWith('/') ? filePath.slice(1) : filePath);
        // Security check - ensure path is within uploads directory
        if (!absolutePath.startsWith(UPLOAD_DIR)) {
            console.error('Attempted to delete file outside uploads directory');
            return false;
        }
        if (fs_1.default.existsSync(absolutePath)) {
            fs_1.default.unlinkSync(absolutePath);
            console.log(`Successfully deleted file: ${absolutePath}`);
            return true;
        }
        else {
            console.warn(`File not found: ${absolutePath}`);
            return false;
        }
    }
    catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        return false;
    }
};
exports.deleteFile = deleteFile;
