import express from "express";
import config from "config";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./utils/logger";
import { version } from "../package.json";
import socket from "./socket";
import UserConnectionService from "./services/UserConnectionService";

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

const service = new UserConnectionService(io);

app.get("/", (_, res) => res.send(`Server is up and running version: ${version}`));

httpServer.listen(port, host, () => {
    logger.info(`Server is listening (version: ${version})`);
    logger.info(`http://${host}:${port}`);

    socket({ io, service });
});