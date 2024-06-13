import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { Button } from "./ui/button";
import { fetchResponse } from "@/utils/fetchUtils";
import { IconCreditGray } from "./icon";
import Link from "next/link";

function CreditIndicator() {
  const router = useRouter();
  const { user, isLoading, isError } = useUser();

  async function initiatePayment() {
    try {
      const data = await fetchResponse({
        method: "POST",
        url: "/api/payment/initiate",
      });

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div
        className="w-full align-left text-left text-sm px-6 py-4 text-gray-700 border-t transition-opacity duration-200 ease-in-out flex gap-1 items-center"
        style={{ transitionDelay: "0.1s" }}
      >
        <IconCreditGray /> {user && user.credits} credits left
      </div>
      {user && user.subscriptionStatus === "not subscribed" && (
        <div className="px-4 w-full">
          <Link href="/choose-plan">
            <Button size="sm" className="text-xs w-full mb-4">
              Upgrade
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CreditIndicator;
