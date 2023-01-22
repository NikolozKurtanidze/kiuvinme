import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import socket from "../socket";

export interface User {
    username: string;
    socketId: string;
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

    constructor(private readonly io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {}
    
    public addUser(user: User) {
        this.usersQueue.push(user);
        if (this.usersQueue.length === 1) {
            return;
        }
        this.pairUser();
    }

    public sendMessage(message: Message) {
        this.io.to(message.toSocketId).emit("receiveMessage", { message });
    }

    private pairUser() {
        if (this.usersQueue.length > 1) {
            const user1 = this.usersQueue.pop();
            const user2 = this.usersQueue.shift();
            if (user1 && user2) {
                this.io.to(user1.socketId).emit("foundPair", { user: user2 });
                this.io.to(user2.socketId).emit("foundPair", { user: user1 });
            }
        }
    }

    removeUser(socketId: string) {
        this.usersQueue = this.usersQueue.filter((user) => user.socketId !== socketId);
    }
}

export default UserConnectionService;