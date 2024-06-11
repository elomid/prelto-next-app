import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";

const useUser = () => {
  const { data, error } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: false,
  });
  useEffect(() => {
    if (data && process.env.NEXT_PUBLIC_ENV !== "local") {
      window &&
        window.FS &&
        window.FS("setIdentity", data.id, {
          email: data.email,
        });
    }
  }, [data]);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
