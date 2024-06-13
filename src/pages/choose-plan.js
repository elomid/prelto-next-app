import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { fetchResponse } from "@/utils/fetchUtils";

const STRIPE_PRICES = [
  {
    priceId: process.env.NEXT_PUBLIC_STRIPE_LITE_PRICE_ID,
    title: "Lite",
    order: 1,
    features: ["1000 monthly credits", "Up to 400 posts per subreddit"],
    price: 10,
  },
  {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    title: "Pro",
    order: 2,
    features: ["3500 monthly credits", "Up to 1000 posts per subreddit"],
    price: 30,
  },
  {
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    title: "Business",
    order: 3,
    features: [
      "Unlimited credits",
      "Unlimited posts per subreddit",
      "Premium supprot",
    ],
    price: 200,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  async function initiatePayment(priceId) {
    setLoading(true);
    try {
      const data = await fetchResponse({
        method: "POST",
        url: "/api/payment/initiate",
        body: { priceId: priceId },
      });
      setLoading(false);
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Layout>
      <h1 className="text-3xl font-medium tracking-tight mb-6">
        Choose your plan
      </h1>

      <ul className="flex flex-col gap-3">
        {STRIPE_PRICES.map((plan) => (
          <li key={plan.order}>
            <Card className="p-10 flex flex-col gap-3 rounded-3xl">
              <div>
                <div className="mb-3">
                  <Label className="text-xl">{plan.title}</Label>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-4xl font-medium">${plan.price}</p>
                  <div className="text-gray-500 text-xs">
                    <p>per</p>
                    <p>month</p>
                  </div>
                </div>
              </div>
              <ul className="flex flex-col gap-1 py-4">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-700">
                    • {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.order === 2 ? "" : "outline"}
                className="mr-auto"
                onClick={() => initiatePayment(plan.priceId)}
                disabled={loading}
              >
                Subscribe
              </Button>
            </Card>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
