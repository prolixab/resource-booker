import Head from "next/head";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import OpenCalendarView from "@/components/OpenCalendarView/OpenCalendarView";

export default function Home() {
  return (
    <>
      <Head>
        <title>3DED</title>
        <meta name="description" content="Booking app for 3DED." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full bg-gray-200">
        <div
          className="min-w-full min-h-screen flex flex-col justify-center items-center p-4"
          style={{ minWidth: 250, maxWidth: 800, margin: "auto" }}
        >
          <OpenCalendarView />
        </div>
      </div>
    </>
  );
}
