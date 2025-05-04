import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import http from "http";

const app: Application = express();


var server = http.createServer(app);

var io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

app.use(express.json());

app.use(cors());

io.on("Connection", (socket) => {
    console.log("connected");
});

app.use('/api', router);

app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
    res.send("update images store");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(error, req, res, next);
})

app.use((req: Request, res: Response, next: NextFunction) => {
    notFound(req, res, next);
});


export default app;