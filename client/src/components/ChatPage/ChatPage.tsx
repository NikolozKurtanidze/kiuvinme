import { useSocket } from "@/context/useSocket";
import { Button, Input, Text, Container } from "@nextui-org/react";
import { observer } from "mobx-react";
import { v4 } from "uuid";
import styles from "./ChatPage.module.scss";
import Message from "../Message/Message";

const ChatPage = () => {
  const socketValue = useSocket();

  if (!socketValue) {
    return null;
  }

  const { store } = socketValue;

  const handlePress = () => {
    store.sendMessage();
  };

  return (
    <div className={styles["page"]}>
      <Text h5 weight="bold" color="secondary">
        {store.username} is chatting with {store.receiver?.username}
      </Text>
      <Container id="container" direction="column" className={styles["chat"]}>
        {store.messages.map((message, index) => (
          <Message
            isSent={message.bySocketId === store.socket.id}
            isLastMessage={index === store.messages.length - 1}
            key={v4()}
            message={message}
          />
        ))}
      </Container>
      <div className={styles["input-container"]}>
        <Input
          aria-labelledby="username"
          aria-label="username-input"
          placeholder="Message"
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handlePress();
            }
          }}
          onChange={(e) => store.setMessageValue(e.target.value)}
          value={store.messageValue}
          size="lg"
        />
        <Button
          auto
          color="primary"
          disabled={store.messageValue === "" || !/\S/.test(store.messageValue)}
          size="md"
          onPress={() => handlePress()}
        >
          Send
        </Button>
        <Button
          auto
          color="secondary"
          size="md"
          onPress={() => store.resetStore()}
        >
          New Pair
        </Button>
      </div>
    </div>
  );
};

export default observer(ChatPage);
