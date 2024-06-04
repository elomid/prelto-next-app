import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotApprovedPage = () => {
  return (
    <div>
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>Email not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            We couldn't find your email in our approved users list. Make sure
            your email is correct. Contact omid.elli@gmail.com if you need
            assistance.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href="/">
            <Button variant="black">Home</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotApprovedPage;
