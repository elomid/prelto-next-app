import { useEffect } from "react";
import { useRouter } from "next/router";
import mixpanel from "../lib/mixpanel";

import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      mixpanel.track("Page Viewed", { url });
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}
