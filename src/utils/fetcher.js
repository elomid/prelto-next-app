import { parseCookies } from "nookies";

async function fetcher(url) {
  const { token } = parseCookies();
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export default fetcher;
