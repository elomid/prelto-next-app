import { useEffect } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

const AuthenticatedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      setCookie(null, "token", token, { path: "/" });
      router.push("/collections");
    }
  }, [router]);

  return null;
};

export default AuthenticatedPage;
