import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserProfile() {
  const router = useRouter();
  const { user, isLoading, isError } = useUser();
  function handleLogOut() {
    destroyCookie(null, "token");
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full align-left text-left text-sm px-6 py-4 text-gray-700 border-t transition-opacity duration-200 ease-in-out hover:bg-gray-100"
          style={{ transitionDelay: "0.1s" }}
        >
          {user && user.email}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onSelect={handleLogOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserProfile;
