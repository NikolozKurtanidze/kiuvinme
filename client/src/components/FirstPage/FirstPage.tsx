import { useSocket } from "@/context/useSocket";
import { Input, Button } from "@nextui-org/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { FcNext } from "react-icons/fc";
import styles from "./FirstPage.module.scss";
import HomeFormStore from "./HomeFormStore";

interface FirstPageProps {
  store: HomeFormStore;
}

const FirstPage = ({ store }: FirstPageProps) => {
  const socketValue = useSocket();
  const [sessionUsername, setSessionUsername] = useState<string>();
  
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (username) setSessionUsername(username);
  }, [setSessionUsername]);

  if (!socketValue) return null;

  if (sessionUsername) {
    store.setUsernameValue(sessionUsername);
  }

  const { socket, store: globalStore } = socketValue;

  const handleOnClick = () => {
    globalStore.setUsername(store.form.controls.username.value);
    const socketId = socket.id;
    socket.emit("seekingForPair", { username: store.form.controls.username.value, socketId });
  }
  
  return (
        <div className={styles["username-container"]}>
          <Input
            aria-labelledby="username-input"
            aria-label="username-input"
            value={store.form.controls.username.value}
            onChange={(e) => {
              store.setUsernameValue(e.target.value);
              sessionStorage.setItem("username", e.target.value);
            }}
            size="xl"
            placeholder="Username" />
          <Button
            auto
            onPress={handleOnClick}
            disabled={store.form.controls.username.invalid}
            size="md"
            icon={<FcNext className={styles["icon"]} />}
            shadow>
              Next
          </Button>
        </div>
    );
};

export default observer(FirstPage);