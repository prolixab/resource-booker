import { supabase } from "@/lib/initSupabase";
import "@/styles/app.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import Layout from "./layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LocalizationProvider>
    </SessionContextProvider>
  );
}
