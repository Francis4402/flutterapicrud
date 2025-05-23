"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_route_1 = require("../modules/posts/post_route");
const auth_routes_1 = require("../modules/Authentications/Auth/auth_routes");
const user_routes_1 = require("../modules/User/user_routes");
const messages_route_1 = require("../modules/messages/messages_route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/posts',
        route: post_route_1.postRoute
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/allusers',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/messages',
        route: messages_route_1.messagesRoute,
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
