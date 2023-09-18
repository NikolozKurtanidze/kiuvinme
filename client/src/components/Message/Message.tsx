import { MutableRefObject, useEffect, useRef } from "react";
import ChatStore, { Message } from "../ChatPage/ChatStore";
import { Text } from "@nextui-org/react";

export interface MessageProps {
  message: Message;
  isLastMessage: boolean;
  isSent: boolean;
}

const Message = ({ message, isLastMessage, isSent }: MessageProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isLastMessage) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLastMessage]);

  return (
    <Text
      ref={ref}
      style={{
        maxWidth: "50%",
        wordWrap: "break-word",
        ...(isSent ? { marginLeft: "50%", backgroundColor: "#0072F5" } : {}),
      }}
      blockquote
    >
      {message.value}
    </Text>
  );
};

export default Message;
