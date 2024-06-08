import Link from "next/link";
import { useRouter } from "next/router";
import { IconSettings, IconCollections, IconAnswers } from "./icon";
import useUser from "@/hooks/useUser";
import UserProfile from "@/components/UserProfile";

const MenuItem = ({ href, iconComponent }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex justify-center items-center px-4 py-3 rounded-full transition-all duration-200 ease-in-out h-[44px] w-[44px] ${
          isActive
            ? "bg-[#F0F4F4] text-black"
            : "hover:bg-[#F0F4F4] text-gray-700"
        }`}
      >
        <div>{iconComponent}</div>
      </Link>
    </li>
  );
};

const CollectionLayout = ({ children }) => {
  const { user, isLoading, isError } = useUser();

  return (
    <div>
      <aside className="fixed h-full border-r bg-white flex flex-col justify-between w-20">
        <nav className="font-medium text-sm h-full pt-8 z-50">
          <ul className="flex flex-col gap-1 group  px-5">
            <MenuItem href="/collections" iconComponent={<IconCollections />} />
            <MenuItem href="/settings" iconComponent={<IconSettings />} />
          </ul>
        </nav>
      </aside>
      <main className="px-16 pl-32 mr-auto max-w-[1400px] py-8">
        {children}
      </main>
    </div>
  );
};

export default CollectionLayout;
