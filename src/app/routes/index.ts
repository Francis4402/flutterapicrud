import { Router } from "express";
import { postRoute } from "../modules/posts/post_route";


const router = Router();

const moduleRoutes = [
    {
        path: '/posts',
        route: postRoute
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;