import { useEffect } from "react";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <button
    //       className="w-full align-left text-left text-sm px-6 py-4 text-gray-700 border-t transition-opacity duration-200 ease-in-out hover:bg-gray-100"
    //       style={{ transitionDelay: "0.1s" }}
    //     >
    //       {user && user.credits} credits left
    //     </button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="w-56">
    //     <DropdownMenuItem>Manage</DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div>
      <div
        className="w-full align-left text-left text-sm px-6 py-4 text-gray-700 border-t transition-opacity duration-200 ease-in-out"
        style={{ transitionDelay: "0.1s" }}
      >
        {user && user.credits} credits left
      </div>
      {user && user.subscriptionStatus !== "active" && (
        <div className="text-xs flex items-center px-4 py-3 justify-between rounded-full bg-gray-100 mx-4 mb-4">
          Get more credits
          <Button onClick={initiatePayment} size="sm" className="text-xs">
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
}

export default CreditIndicator;
