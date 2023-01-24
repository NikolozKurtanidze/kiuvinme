import { Server , Socket } from "socket.io";
import UserConnectionService, { Message } from "./services/UserConnectionService";
import logger from "./utils/logger";

const EVENTS = {
    connection: "connection",
    disconnect: "disconnect",
};

function socket({ io, service }: { io: Server, service: UserConnectionService }) {
    logger.info(`Sockets enabled`);

    io.on(EVENTS.connection, (socket) => {
        logger.info(`User connected: ${socket.id}`);

        socket.on("seekingForPair", ({ username, socketId }: { username: string, socketId: string }) => {
            service.addUser({ username, socketId });
        });

        socket.on("sendMessage", (message: Message) => service.sendMessage(message));

        socket.on("disconnect", () => service.removeUser(socket.id));

        socket.on("getLiveCounter", (callback: ({ liveCounter } : { liveCounter: number }) => void) => {
            callback({ liveCounter: service.liveCounter });
        });
    });
}

export default socket;