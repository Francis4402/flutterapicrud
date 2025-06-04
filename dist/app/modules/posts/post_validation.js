"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidationShcema = void 0;
const zod_1 = require("zod");
exports.postValidationShcema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(100),
        downloadUrl: zod_1.z.string().min(1).max(100),
        imageUrls: zod_1.z.string(),
    })
});
