"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Avatar, Input, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, } from "@nextui-org/react";
import { ThemeSwitch } from "./theme-switch";
import Link from "next/link";
import { MessageCircle as ChatIcon, Home as HomeIcon, Search as SearchIcon, AlertOctagon as LogOutIcon, Users as FriendIcon, PieChart as ChartIcon, Image as PhotoIcon, Heart as LikeIcon, Star as StarIcon, Menu as MenuIcon, Sliders as OptionsIcon, ArrowLeftCircle as CloseIcon, } from "@geist-ui/icons";
import PageChat from "@/app/chat/chatModal";
import ProfileUser from "./ProfileUser";

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getMyProfile(token);
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        console.error("Error en el logout:", await response.text());
        throw new Error("Fallo en el logout.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Intente nuevamente.");
    }
  };

  const getMyProfile = async (token: string) => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error al obtener el perfil:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      alert("Error al obtener el perfil. Intente nuevamente.");
    }
  };

  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full h-20 px-4 min-sm:px-8 bottom-6">
        <nav className="flex items-center justify-between flex-grow w-full h-full px-4 bg-white border-2 rounded-lg border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
          <div className="lg:min-w-96">
            <div className="flex items-center justify-start gap-4">
              <Avatar
                isBordered
                size="sm"
                color="success"
                src={
                  user?.image?.secure_url || "https://via.placeholder.com/150"
                }
              />
              <div className="flex flex-col">
                <strong className="text-base m-0">{user?.fullname}</strong>
                <span className="font-medium text-[#dd2525] text-[70%] m-0">
                  @{user?.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-4 max-w-64 max-lg:hidden">
            <Link
              href="/posts"
              className={`flex items-center gap-2 py-2 px-6 rounded-lg ${pathname === "/posts"
                  ? "bg-[#dd2525] text-white"
                  : "text-zinc-600 dark:text-white"
                }`}
            >
              {pathname === "/posts" && <HomeIcon />}
              Home
            </Link>
            <ProfileUser />
            <button
              onClick={() => setIsChatOpen(true)}
              className={`py-2 px-6 rounded-lg ${pathname === "/Chats"
                  ? "bg-[#dd2525] text-white"
                  : "text-zinc-600 dark:text-white"
                }`}
            >
              {pathname === "/Chats" && <ChatIcon />}
              Chats
            </button>
          </div>
          <div className="flex justify-end gap-4 pl-4 xl:min-w-96">
            <Input
              startContent={<SearchIcon />}
              className="w-full bg-white shadow-sm max-w-44 dark:bg-zinc-900 max-md:hidden"
              placeholder="Search..."
            />
            <ThemeSwitch />
            <Dropdown
              showArrow
              backdrop="blur"
              classNames={{
                base: "before:bg-default-200",
                content:
                  "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
              }}
            >
              <DropdownTrigger className="grid place-content-center">
                <button className="w-10 p-2 transition-colors duration-100 rounded-md bg-[#dd2525] hover:bg-danger-700 dark:hover:bg-zinc-600 max-md:grid place-content-center">
                  <MenuIcon className="w-5 h-5 stroke-white" />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Link Actions">
                <DropdownItem
                  key="posts"
                  className={`${pathname === "/posts"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                    }`}
                >
                  <Link href="/posts" className="flex items-center gap-2">
                    <HomeIcon className="w-5 h-5" />
                    <span className="text-sm ">Home</span>
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="Chat"
                  className={`${pathname === "/chats"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                    }`}
                  onClick={() => setIsChatOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <ChatIcon className="w-5 h-5" />
                    <span className="text-sm ">Chat</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Friends"
                  className={`${pathname === "/friends"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                    }`}
                >
                  <Link href="/friends" className="flex items-center gap-2">
                    <FriendIcon className="w-5 h-5" />
                    <span className="text-sm ">Friends</span>
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="Dashboard"
                  className={`${pathname === "/dashboard"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                    }`}
                >
                  <Link href="/admin" className="flex items-center gap-2">
                    <ChartIcon className="w-5 h-5" />
                    <span className="text-sm ">Dashboard</span>
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="Photos"
                  className={`${pathname === "/chats"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                    }`}
                >
                  <Link href="/photos" className="flex items-center gap-2">
                    <PhotoIcon className="w-5 h-5" />
                    <span className="text-sm ">Photos</span>
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="Saves"
                  className={`${pathname === "/friends"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                    }`}
                >
                  <Link href="/saves" className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5" />
                    <span className="text-sm ">Saves</span>
                  </Link>
                </DropdownItem>
                <DropdownItem key="Logout" onClick={() => handleLogout()}>
                  <div className="flex items-center gap-2">
                    <CloseIcon className="w-5 h-5" />
                    <span className="text-sm ">Logout</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </nav>
      </div>
      <PageChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

export default NavBar;
