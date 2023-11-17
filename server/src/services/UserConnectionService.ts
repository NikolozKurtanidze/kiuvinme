import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import socket from "../socket";
import logger from "../utils/logger";

export interface User {
  username: string;
  socketId: string;
  pairId?: string;
  addedOn: string;
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
  private users: User[] = [];
  private waitingUsers: User[] = [];

  constructor(
    private readonly io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >
  ) {
    setInterval(() => {
      this.users.forEach((user) => this.checkIfUserAlive(user));
    }, 5000);
  }

  public clearAllUsers() {
    this.users.forEach((user) => this.removeUser(user.socketId));
  }

  public get stringUsers(): string {
    return JSON.stringify(this.users);
  }

  private checkIfUserAlive(user: User) {
    this.io
      .to(user.socketId)
      .timeout(5000)
      .emit("areYouAlive", (err: any) => {
        if (err) {
          this.removeUser(user.socketId);
        }
      });
  }

  public shareLiveCounter() {
    this.io.emit("liveCounter", { liveCounter: this.users.length });
  }

  get liveCounter(): number {
    return this.users.length;
  }

  public addUser(user: User) {
    this.users.push(user);
    this.pairUser(user);
    this.shareLiveCounter();
  }

  public sendMessage(message: Message) {
    this.io
      .to(message.toSocketId)
      .timeout(5000)
      .emit("receiveMessage", { message }, (err: any) => {
        if (err) {
          this.removeUser(message.bySocketId);
        }
      });
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
    const user = this.users.find((user) => user.socketId === socketId);
    const waitingUser = this.waitingUsers.find((user) => user.socketId === socketId);
    this.users = this.users.filter((user) => user.socketId !== socketId);
    this.waitingUsers = this.waitingUsers.filter(
      (user) => user.socketId !== socketId
    );
    if (user) {
      this.io.to(user.socketId).emit("youAreDisconnected");
      if (user.pairId) {
        this.io.to(user.pairId).emit("pairDisconnected");
      }
    }

    if (waitingUser) {
      this.io.to(waitingUser.socketId).emit("youAreDisconnected");
    }

    this.shareLiveCounter();
  }
}

export default UserConnectionService;
