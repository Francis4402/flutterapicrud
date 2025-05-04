"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_route_1 = require("../modules/posts/post_route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/posts',
        route: post_route_1.postRoute
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
