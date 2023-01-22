import { observer } from 'mobx-react';
import Head from 'next/head';
import styles from "../styles/Home.module.scss";
import { Button, Link, Loading, Modal, Text, useModal } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import HomeFormStore from '@/components/FirstPage/HomeFormStore';
import FirstPage from '@/components/FirstPage/FirstPage';
import ChatPage from '@/components/ChatPage/ChatPage';
import { useSocket } from '@/context/useSocket';
import { AiOutlineInfoCircle } from "react-icons/ai";

function Home() {
  const [store] = useState(() => new HomeFormStore());
  const { setVisible, bindings } = useModal();

  const socketValue = useSocket();

  useEffect(() => console.log("effect"), []);

  if (!socketValue) return null;

  const {  store: globalStore } = socketValue;

  return (
    <>
      <Head>
        <title>kiuvinme</title>
        <meta name="description" content="Meet random people from KIU" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className={styles["main"]}>
        <Text
          h1
          weight="bold"
          css={{
            textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}>
          kiuvinme
        </Text>
        <div className={styles["content"]}>
          {globalStore.isSearching ? (
            <div className={styles["loading-container"]}>
              <Text color="secondary" h4>Searching for your pair :)</Text>
              <Loading color="secondary" type="points" />
            </div>
            ) : (
            <>
              {!globalStore.username ? (
                <FirstPage store={store} />
              ) : (
                <ChatPage />
              )
              }
            </>
          )
          }
        </div>
        <Button
          style={{position: "absolute", left: 0, top: 0, margin: "15px"}}
          color="secondary"
          auto
          icon={<AiOutlineInfoCircle />}
          onPress={() => setVisible(true)}/>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          closeButton
          blur
          {...bindings}>
          <Modal.Header>
            <Text h3 color="secondary">
              What is kiuvinme
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Text>
              Someone in kiu confessions group requested to make website like vinme.ge but for kiu students,
              Since I didn&apos;t have anything to do I&apos;ve decided to implement it myself. It might have a lot of bugs since I&apos;ve done it overnight (6 hours total),
              So don&apos;t be strict and try to have fun. Messages are completely anonymous, you can check the source code here:
              <Link href="https://github.com/NikolozKurtanidze/kiuvinme">https://github.com/NikolozKurtanidze/kiuvinme</Link><br />
              (Would appreciate repo stars ;) <br /> Thanks to #5581 confession author {"<3"} 
            </Text>
            <Modal.Footer>
              <Text
                weight="bold"
                css={{
                  textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}>
                  #დააბრუნეთოთო
              </Text>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  return { props: {} };
}

export default observer(Home); 
