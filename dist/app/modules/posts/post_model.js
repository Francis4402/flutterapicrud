"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    downloadUrl: {
        type: String,
        required: true,
    },
    imageUrls: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.PostModel = (0, mongoose_1.model)('posts', PostSchema);
