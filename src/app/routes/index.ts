import { Router } from "express";
import { postRoute } from "../modules/posts/post_route";
import { AuthRoutes } from "../modules/Authentications/Auth/auth_routes";


const router = Router();

const moduleRoutes = [
    {
        path: '/posts',
        route: postRoute
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;