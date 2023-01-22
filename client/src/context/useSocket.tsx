import { SOCKET_URL } from "@/config/default";
import { io, Socket } from "socket.io-client";
import { createContext, useContext, useState } from "react";
import ChatStore from "@/components/ChatPage/ChatStore";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const socket = io(SOCKET_URL);

socket.emit("test");

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
