import { Server } from "socket.io";
import Discord from "discord.js";
import UserConnectionService, { Message } from "./services/UserConnectionService";
import logger from "./utils/logger";
import config from "config";

const EVENTS = {
    connection: "connection",
    disconnect: "disconnect",
};

function socket({ io, service }: { io: Server, service: UserConnectionService }) {
    logger.info(`Sockets enabled`);

    io.on(EVENTS.connection, (socket) => {
        logger.info(`User connected: ${socket.id}`);

        socket.on("seekingForPair", ({ username, socketId }: { username: string, socketId: string }) => {
            const addedOn = new Date().toUTCString();
            service.addUser({ username, socketId, addedOn });
        });

        socket.on("sendMessage", (message: Message) => service.sendMessage(message));

        socket.on("disconnect", () => service.removeUser(socket.id));

        socket.on("getLiveCounter", (callback: ({ liveCounter } : { liveCounter: number }) => void) => {
            callback({ liveCounter: service.liveCounter });
        });
    });
}

export default socket;