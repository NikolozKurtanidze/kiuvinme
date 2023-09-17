import { io, Socket } from "socket.io-client";
import { createContext, useContext, useState } from "react";
import ChatStore from "@/components/ChatPage/ChatStore";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!socketUrl) {
    throw new Error("Socket URL should be defined in env variables");
}

const socket = io(socketUrl);

export interface SocketContextValue {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    store: ChatStore;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

function SocketsProvider(props: any) {
    const [store] = useState(() => new ChatStore(socket));

    return <SocketContext.Provider value={{ socket, store }} {...props} />
}

export const useSocket = () => useContext(SocketContext);

export default SocketsProvider;
