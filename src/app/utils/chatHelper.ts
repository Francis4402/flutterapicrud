export const getRoomId = (user1: string, user2: string) => {
    return [user1, user2].sort().join('_');
};