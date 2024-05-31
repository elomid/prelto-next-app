import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const useUser = () => {
  const { data, error } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: false,
  });
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
