import { Server , Socket } from "socket.io";
import UserConnectionService, { Message } from "./services/UserConnectionService";
import logger from "./utils/logger";

const EVENTS = {
    connection: "connection",
};

function socket({ io, service }: { io: Server, service: UserConnectionService }) {
    logger.info(`Sockets enabled`);

    io.on(EVENTS.connection, (socket) => {
        logger.info(`User connected: ${socket.id}`);

        socket.on("seekingForPair", ({ username, socketId }: { username: string, socketId: string }) => {
            service.addUser({ username, socketId });
        });

        socket.on("sendMessage", (message: Message) => service.sendMessage(message));

        socket.on("disconnectUser", ({ pairSocketId }: { pairSocketId: string}) => service.removeUser(socket.id, pairSocketId));
    })

}

export default socket;