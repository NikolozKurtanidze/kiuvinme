import { useSocket } from "@/context/useSocket"
import { Button, Input, Text, Container } from "@nextui-org/react";
import { observer } from "mobx-react";
import { v4 } from "uuid";
import styles from "./ChatPage.module.scss";

const ChatPage = () => {
    const socketValue = useSocket();

    if (!socketValue) {
        return null;
    }

    const { store } = socketValue;
    
    const handlePress = () => {
        store.sendMessage();
    }

    return (
        <div className={styles["page"]}>
            <Text h5 weight="bold" color="secondary">{store.username} is chatting with {store.receiver?.username}</Text>
            <Container id="container" direction="column" className={styles["chat"]}>
                {store.messages.map((message) => {
                    if (message.bySocketId !== store.socket.id) {
                        return (
                            <Text key={v4()} style={{maxWidth: "50%", wordWrap: "break-word"}} blockquote>
                                {message.value}
                            </Text>
                        );
                    }
                    return (
                        <Text key={v4()} style={{marginLeft: "50%", maxWidth: "50%", wordWrap: "break-word", backgroundColor: "#0072F5"}}  blockquote>
                            {message.value}
                        </Text>

                    );
                })}
            </Container>
            <div className={styles["input-container"]}>
                <Input
                    aria-labelledby="username"
                    aria-label="username-input"
                    placeholder="Message"
                    onChange={(e) => store.setMessageValue(e.target.value)}
                    value={store.messageValue}
                    size="lg"
                    />
                <Button
                    auto
                    color="primary"
                    disabled={store.messageValue === ""}
                    size="md"
                    onPress={() => handlePress()}>
                        Send
                </Button>
                <Button
                    auto
                    color="secondary"
                    size="md"
                    onPress={() => store.resetStore()}>
                        New Pair
                </Button>
            </div>
        </div>
    );
}

export default observer(ChatPage);