import express from "express";
import cors from "cors";
import config from "config";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./utils/logger";
import { version } from "../package.json";
import socket from "./socket";
import UserConnectionService from "./services/UserConnectionService";

const port = config.get<number>("port");
const host = config.get<string>("host");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

const service = new UserConnectionService(io);

app.get("/", cors(), (_, res) => res.send(`Server is up and running version: ${version}`));

httpServer.listen(port || 4000, () => {
    logger.info(`Server is listening (version: ${version})`);
    logger.info(`http://${host}:${port}`);

    socket({ io, service });
});