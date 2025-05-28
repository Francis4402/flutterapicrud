"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', routes_1.default);
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("FLutter Chat API");
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.use((error, req, res, next) => {
    (0, globalErrorhandler_1.default)(error, req, res, next);
});
app.use((req, res, next) => {
    (0, notFound_1.default)(req, res, next);
});
exports.default = app;
