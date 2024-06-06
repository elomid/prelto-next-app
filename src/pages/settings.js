import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";

import { Button } from "@/components/ui/button";
import { fetchResponse } from "@/utils/fetchUtils";

export default function SettingsPage() {
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
  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
      </div>
      <Card>
        <Button onClick={handleManageSubscription}>
          Manage your subscription
        </Button>
      </Card>
    </Layout>
  );
}
