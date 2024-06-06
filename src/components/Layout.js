import Link from "next/link";
import { useRouter } from "next/router";
import { IconSettings, IconCollections, IconAnswers } from "./icon";
import useUser from "@/hooks/useUser";
import UserProfile from "@/components/UserProfile";
import { fetchResponse } from "@/utils/fetchUtils";
import { Button } from "./ui/button";

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <div className="flex h-full">
      <aside className="w-64 fixed h-full border-r bg-white flex flex-col justify-between">
        <nav className="font-medium text-sm h-full pt-8 px-5">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/collections"
                className={`flex w-full h-full justify-between items-center px-4 py-3 rounded-full transition-all ${
                  router.pathname === "/collections"
                    ? "bg-[#F0F4F4] text-black"
                    : "hover:bg-[#F0F4F4] text-gray-700"
                }`}
              >
                Collections
                <IconCollections
                  fill={
                    router.pathname === "/collections" ? "black" : "#585858"
                  }
                />
              </Link>
            </li>
            <li className="">
              <Link
                href="/settings"
                className={`flex w-full h-full justify-between items-center px-4 py-3 rounded-full transition-all ${
                  router.pathname === "/settings"
                    ? "bg-[#F0F4F4] text-black"
                    : "hover:bg-[#F0F4F4] text-gray-700"
                }`}
              >
                Settings
                <IconSettings />
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          {/* <div>
            <Button onClick={initiatePayment}>Upgrade</Button>
          </div> */}
          <UserProfile />
        </div>
      </aside>
      <main className="ml-64 w-full h-full">
        <div className="p-8 max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

async function initiatePayment() {
  console.log("initiating payments...");
  try {
    const data = await fetchResponse({
      method: "POST",
      url: "/api/payment/initiate",
    });

    console.log("url from stripe: ", data.url);

    window.location.href = data.url;
  } catch (error) {
    console.error(error);
  }
}
