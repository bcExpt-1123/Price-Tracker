import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Layout>
        <Head>
          <title>Arkuçi - Ürün Takip Sistemi</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
export default MyApp;
