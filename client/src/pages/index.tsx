import { observer } from "mobx-react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import {
  Button,
  Link,
  Loading,
  Modal,
  Text,
  useModal,
} from "@nextui-org/react";
import { useState } from "react";
import HomeFormStore from "@/components/FirstPage/HomeFormStore";
import FirstPage from "@/components/FirstPage/FirstPage";
import ChatPage from "@/components/ChatPage/ChatPage";
import { useSocket } from "@/context/useSocket";
import { BsQuestion } from "react-icons/bs";

function Home() {
  const [store] = useState(() => new HomeFormStore());
  const { setVisible, bindings } = useModal();

  const socketValue = useSocket();

  if (!socketValue) return null;

  const { store: globalStore } = socketValue;

  return (
    <>
      <Head>
        <title>kiuvinme</title>
      </Head>
      <main className={styles["main"]}>
        <Text
          h1
          weight="bold"
          css={{
            textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}
        >
          kiuvinme
        </Text>
        <div className={styles["content"]}>
          {globalStore.isSearching ? (
            <div className={styles["loading-container"]}>
              <Text color="secondary" h4>
                Searching for your pair :)
              </Text>
              <Loading color="secondary" type="points" />
            </div>
          ) : (
            <>
              {!globalStore.username ? (
                <FirstPage store={store} />
              ) : (
                <ChatPage />
              )}
            </>
          )}
        </div>
        <div className={styles["users-counter"]}>
          {globalStore.usersCounter !== null ? (
            <Text
              color="secondary"
              h4
              className={styles["users-counter__text"]}
            >
              {globalStore.usersCounter}
            </Text>
          ) : (
            <Loading color="secondary" size="sm" />
          )}
          <Text color="secondary" h4 className={styles["users-counter__text"]}>
            Active users
          </Text>
        </div>
        <Button
          style={{ position: "absolute", right: 0, top: 0, margin: "15px" }}
          color="secondary"
          auto
          icon={<BsQuestion className={styles["question-icon"]} />}
          onPress={() => setVisible(true)}
        />
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          closeButton
          blur
          {...bindings}
        >
          <Modal.Header>
            <Text h3 color="secondary">
              What is kiuvinme
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Text>
              Chat with strangers in KIU. Messages are completely anonymous, you
              can check the source code here:
              <Link href="https://github.com/NikolozKurtanidze/kiuvinme">
                https://github.com/NikolozKurtanidze/kiuvinme
              </Link>
              <br />
              (Would appreciate repo stars ;)
            </Text>
            <Modal.Footer>
              <Text
                weight="bold"
                css={{
                  textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}
              >
                #გახსენითწითელი
              </Text>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default observer(Home);
