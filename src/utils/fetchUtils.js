import { parseCookies } from "nookies";

export async function fetchResponse({
  method,
  url,
  isProtected = true,
  body = {},
}) {
  const { token } = parseCookies();

  if (isProtected && !token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(isProtected && token && { Authorization: `Bearer ${token}` }),
    },
    ...(Object.keys(body).length > 0 && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { status: response.status, message: errorData.message };
  }

  const data = await response.json();
  return data;
}
