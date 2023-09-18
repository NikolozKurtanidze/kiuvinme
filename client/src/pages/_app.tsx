import SocketsProvider from "@/context/useSocket";
import "@/styles/globals.css";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";

const darkTheme = createTheme({
  type: "dark",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={darkTheme}>
      <SocketsProvider>
        <Component {...pageProps} />
      </SocketsProvider>
    </NextUIProvider>
  );
}
