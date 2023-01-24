import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import socket from "../socket";

export interface User {
    username: string;
    socketId: string;
    pairId?: string;
}

export interface UserPair {
    user1: User;
    user2: User;
}

export interface Message {
    value: string;
    bySocketId: string;
    toSocketId: string;
}

class UserConnectionService {
    private usersQueue: User[] = [];
    private waitingUsers: User[] = [];

    constructor(private readonly io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {}
    
    public addUser(user: User) {
        this.usersQueue.push(user);
        this.pairUser(user);
    }

    public sendMessage(message: Message) {
        this.io.to(message.toSocketId).emit("receiveMessage", { message });
    }

    private pairUser(user: User) {
        const pair = this.waitingUsers.shift();
        if (pair) {
            user.pairId = pair.socketId;
            pair.pairId = user.socketId;
            this.io.to(user.socketId).emit("foundPair", { user: pair });
            this.io.to(pair.socketId).emit("foundPair", { user: user });
        } else {
            this.waitingUsers.push(user);
        }
    }

    removeUser(socketId: string) {
        console.log(`User disconnected ${socketId}`);
        const user = this.usersQueue.find((user) => user.socketId === socketId);
        this.usersQueue = this.usersQueue.filter((user) => user.socketId !== socketId);
        if (user && user.pairId) {
            this.io.to(user.pairId).emit("pairDisconnected");
        }
    }
}

export default UserConnectionService;