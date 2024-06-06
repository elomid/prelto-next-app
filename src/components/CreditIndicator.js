import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { Button } from "./ui/button";
import { fetchResponse } from "@/utils/fetchUtils";

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
        className="w-full align-left text-left text-sm px-6 py-4 text-gray-700 border-t transition-opacity duration-200 ease-in-out"
        style={{ transitionDelay: "0.1s" }}
      >
        {user && user.credits} credits left
      </div>
      {user && user.subscriptionStatus === "not subscribed" && (
        <div className="px-4 w-full">
          <Button
            onClick={initiatePayment}
            size="sm"
            className="text-xs w-full mb-4"
          >
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
}

export default CreditIndicator;
