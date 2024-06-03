import { useEffect } from "react";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { parseCookies } from "nookies";

const useRequireAuth = (redirectTo = "/auth/login") => {
  const { user, isLoading, isError } = useUser();
  const router = useRouter();
  const { token } = parseCookies();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
    if (!token) {
      router.push(redirectTo);
    }
  }, [isLoading, user]);

  return { user, isLoading, isError };
};

export default useRequireAuth;
