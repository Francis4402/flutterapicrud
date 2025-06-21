"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomId = void 0;
const getRoomId = (user1, user2) => {
    return [user1, user2].sort().join('_');
};
exports.getRoomId = getRoomId;
