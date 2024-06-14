import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";

import { Button } from "@/components/ui/button";
import { fetchResponse } from "@/utils/fetchUtils";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SettingsPage() {
  const { user, isLoading, isError } = useUser();

  const router = useRouter();
  async function handleManageSubscription() {
    try {
      const data = await fetchResponse({
        method: "POST",
        url: "/api/payment/manage",
      });

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogOut() {
    destroyCookie(null, "token");
    router.push("/");
  }

  return (
    <Layout>
      <div className="flex mb-8 items-start">
        <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
      </div>
      <Card className="flex flex-col rounded-3xl">
        <div className="p-8 flex flex-col gap-4 border-b items-start">
          <Label>Subscription</Label>
          {user && user.subscriptionStatus !== "not subscribed" && (
            <Button variant="outline" onClick={handleManageSubscription}>
              Manage your subscription
            </Button>
          )}
          {user && user.subscriptionStatus === "not subscribed" && (
            <Link href="/choose-plan">
              <Button>Upgrade</Button>
            </Link>
          )}
        </div>

        <div className="p-8 flex flex-col gap-4 border-b items-start">
          <Label>Account</Label>
          {user && user.email && <p className="text-sm">{user.email}</p>}

          <Button variant="outline" onClick={handleLogOut}>
            Log out
          </Button>
        </div>
      </Card>
    </Layout>
  );
}
