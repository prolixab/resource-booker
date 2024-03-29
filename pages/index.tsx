import Head from "next/head";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import ViewAll from "@/components/ViewAll/ViewAll";
import Login from "@/components/Login";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <>
      <Head>
        <title>3DED</title>
        <meta name="description" content="3DED Time Booking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full bg-gray-200">
        {!session ? (
          <Login></Login>
        ) : (
          <div
            className="w-full h-full flex flex-col justify-center items-center p-4"
            style={{ minWidth: 250, maxWidth: 800, margin: "auto" }}
          >
            <ViewAll session={session} />
          </div>
        )}
      </div>
    </>
  );
}
