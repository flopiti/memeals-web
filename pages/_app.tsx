import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import BaseLayout from "@/components/_layouts/BaseLayout";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <UserProvider>
      <Head>
        <title>MeMeals</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/memeals.png" />
      </Head>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </UserProvider>
  );
};

export default appWithTranslation(App);
