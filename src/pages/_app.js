import { useEffect } from "react";
import { useRouter } from "next/router";
import mixpanel from "../lib/mixpanel";
import { initFullStory } from "../lib/fullstory";

import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NEXT_PUBLIC_ENV !== "local") {
        mixpanel.track("Page Viewed", { url });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== "local") {
      initFullStory();
    }
  }, []);
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}
