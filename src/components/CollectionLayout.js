import Link from "next/link";
import { useRouter } from "next/router";
import { IconSettings, IconCollections, IconAnswers } from "./icon";
import useUser from "@/hooks/useUser";
import { useState, useCallback } from "react";
import { debounce } from "@/lib/utils";
import UserProfile from "@/components/UserProfile";

const MenuItem = ({ href, title, isExpanded, iconComponent }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex justify-between w-full h-full items-center px-4 py-3 rounded-full transition-all duration-200 ease-in-out min-h-[44px] ${
          isActive
            ? "bg-[#F0F4F4] text-black"
            : "hover:bg-[#F0F4F4] text-gray-700"
        }`}
      >
        <span
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
          }`}
          style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
        >
          {title}
        </span>
        <div>{iconComponent}</div>
      </Link>
    </li>
  );
};

const Layout = ({ children }) => {
  const { user, isLoading, isError } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = useCallback(
    debounce(() => setIsExpanded(true), 100),
    []
  );
  const handleMouseLeave = useCallback(
    debounce(() => setIsExpanded(false), 100),
    []
  );

  return (
    <div>
      <aside
        className={`fixed h-full border-r bg-white flex flex-col justify-between transition-all duration-200 ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="font-medium text-sm h-full pt-8 px-5 z-50">
          <ul className="flex flex-col gap-1 group">
            <MenuItem
              href="/collections"
              title="Collections"
              iconComponent={<IconCollections />}
              isExpanded={isExpanded}
            />
            <MenuItem
              href="/settings"
              title="Settings"
              iconComponent={<IconSettings />}
              isExpanded={isExpanded}
            />
          </ul>
        </nav>
        {isExpanded && <UserProfile />}
      </aside>
      <main className="px-16 pl-32 mr-auto max-w-[1400px] py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
