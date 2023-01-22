import { ControlsCollection, FormControl, FormGroup, notEmptyOrSpacesValidator } from "@quantumart/mobx-form-validation-kit";
import { action, makeObservable, observable } from "mobx";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface HomeForm extends ControlsCollection {
    message: FormControl<string>;
}

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
    public form: FormGroup<HomeForm>;
    public messages: Message[] = [];
    public username: string | null = null;
    public receiver: User | null = null;
    public isSearching: boolean = false;

    constructor(public readonly socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        makeObservable(this, {
            messages: observable,
            receiver: observable,
            isSearching: observable,
            username: observable,
            resetStore: action,
            setReceiver: action,
            toggleIsSearching: action,
            setUsername: action,
            setMessageValue: action,
            pushMessage: action,
        })
        this.form = new FormGroup<HomeForm>({
            message: new FormControl<string>("", {
                validators: [notEmptyOrSpacesValidator()],
            }),
        });

        this.socket.on("foundPair", ({ user }) => {
            this.setReceiver(user);
            this.toggleIsSearching();
        });

        this.socket.on("pairDisconnected", () => {
            this.resetStore();
        });

        this.socket.on("receiveMessage", ({ message }) => {
            this.pushMessage(message);
        });
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
                value: this.form.controls.message.value,
                bySocketId: this.socket.id,
                toSocketId: this.receiver.socketId,
            };
            this.pushMessage(message);
            this.socket.emit("sendMessage", message);
            this.form.controls.message.value = "";
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
        this.form.controls.message.value = newValue;
    }
}

export default ChatStore;