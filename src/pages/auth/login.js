import { useState } from "react";
import { setCookie } from "nookies";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { IconGoogleLogo } from "@/components/icon";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (data.token) {
        setCookie(null, "token", data.token, { path: "/" });
        window.location.href = "/collections";
      }
    } catch (error) {
      console.error("Error in login: ", error);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your Prelto account</CardDescription>
      </CardHeader>
      <div className="border-b p-6 pt-0">
        <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}>
          <Button variant="outline" className="w-full flex items-center gap-3">
            <IconGoogleLogo />
            <span>Continue with Google</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default LoginPage;
