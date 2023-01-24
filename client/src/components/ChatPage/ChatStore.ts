import { action, makeObservable, observable } from "mobx";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface Message {
    value: string;
    bySocketId: string;
    toSocketId: string;
}

export interface User {
    username: string;
    socketId: string;
}

class ChatStore {
    public messageValue: string = "";
    public messages: Message[] = [];
    public username: string | null = null;
    public receiver: User | null = null;
    public isSearching: boolean = false;
    public usersCounter: number | null = null;

    constructor(public readonly socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        makeObservable(this, {
            messageValue: observable,
            usersCounter: observable,
            messages: observable,
            receiver: observable,
            isSearching: observable,
            username: observable,
            resetStore: action,
            setReceiver: action,
            setUsersCounter: action,
            toggleIsSearching: action,
            setUsername: action,
            setMessageValue: action,
            pushMessage: action,
        });

        this.socket.on("youAreDisconnected", () => this.resetStore());

        this.socket.on("areYouAlive", (callback: () => void) => callback());

        this.socket.emit("getLiveCounter", ({ liveCounter }: { liveCounter: number }) => {
            this.setUsersCounter(liveCounter);
        });

        this.socket.on("liveCounter", ({ liveCounter }) => this.setUsersCounter(liveCounter));

        this.socket.on("foundPair", ({ user }) => {
            this.setReceiver(user);
            this.toggleIsSearching();
        });

        this.socket.on("pairDisconnected", () => {
            this.resetStore();
        });

        this.socket.on("receiveMessage", ({ message }, callback) => {
            this.pushMessage(message);
            callback();
        });
    }

    setUsersCounter(newCounter: number) {
        this.usersCounter = newCounter;
    }

    resetStore() {
        this.socket.emit("disconnectUser", { pairSocketId: this.receiver?.socketId });
        location.reload();
    }

    setReceiver(user: User) {
        this.receiver = user;
    }

    sendMessage() {
        if (this.receiver) {
            const message: Message = {
                value: this.messageValue,
                bySocketId: this.socket.id,
                toSocketId: this.receiver.socketId,
            };
            this.pushMessage(message);
            this.socket.emit("sendMessage", message);
            this.messageValue = "";
        } else {
            location.reload();
        }
    }

    toggleIsSearching() {
        this.isSearching = !this.isSearching;
    }

    setUsername(username: string) {
        this.username = username;
        sessionStorage.setItem("username", this.username);
        this.isSearching = true;
    }

    pushMessage(message: Message) {
        this.messages.push(message);
    }

    setMessageValue(newValue: string) {
        this.messageValue = newValue;
    }
}

export default ChatStore;