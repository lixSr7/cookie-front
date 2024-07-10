"use client";

//? ================== Hooks =====================
import { usePathname } from "next/navigation";

//? ================== Components =====================

import {Avatar, Input, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, } from "@nextui-org/react"; 

import { ThemeSwitch } from "./theme-switch";

import Link from "next/link";
//?================= Icons =====================
import { MessageCircle as ChatIcon, Home as HomeIcon, Instagram as VideoIcon, Search as SearchIcon, AlertOctagon as LogOutIcon, Users as FriendIcon, PieChart as ChartIcon, Image as PhotoIcon, Heart as LikeIcon, Star as StarIcon, Menu as MenuIcon, Sliders as OptionsIcon, } from "@geist-ui/icons"; 
import PageChat from "@/app/chat/page";
import { useState, useEffect } from "react";
import ProfileUser from "./ProfileUser";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ArrowLeftCircle as CloseIcon } from "@geist-ui/icons";

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [token, settoken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      settoken(storedToken);
    }
  })
  const handleLogout = async () => {
    try {
      
  
      const headers: HeadersInit = {};
      if (token) {
        headers["x-access-token"] = token;
      }
  
      const response = await fetch(
        "https://rest-api-cookie-u-c-p.onrender.com/api/auth/logout",
        {
          method: "POST",
          headers: headers,
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
  

  const UserDefault = {
    id: "664d38bedf58852a441800fa",
    role: "user",
    username: "Jhon Doe",
    fullname: "",
    image: {
      public_url: "",
    },
    iat: 1718135199,
  };

  interface UserToken {
    id: string;
    role: string;
    username: string;
    fullname: string;
    image: {
      public_url: string;
    };
    iat: number;
  }

  interface DecodedToken extends UserToken {
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    jti?: string;
  }

  const user: UserToken | DecodedToken = token
    ? {
        ...(jwtDecode(token) as DecodedToken),
      }
    : UserDefault;
  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full h-20 px-4 min-sm:px-8 bottom-6">
        <nav className="flex items-center justify-between flex-grow w-full h-full px-4 bg-white border-2 rounded-lg border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
          <div className=" lg:min-w-96">
            <div className="flex items-center justify-start gap-4">
              <Avatar
                isBordered
                size="sm"
                color='success'
                src={user.image?.public_url}
              />
              <div className="flex flex-col">
                <strong className="text-sm">{user.username}</strong>
                <span className="font-medium text-[#dd2525] text-[60%]">
                  @{user.fullname || user.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-4 max-w-64 max-lg:hidden">
            <Link
              href="/posts"
              className={` flex items-center gap-2 py-2 px-6 rounded-lg ${
                pathname === "/posts"
                  ? "bg-[#dd2525] text-white"
                  : " text-zinc-600 dark:text-white"
              }`}
            >
              {pathname === "/posts" && <HomeIcon />}
              Home
            </Link>
            <ProfileUser />
            <button
              onClick={() => setIsChatOpen(true)}
              className={` py-2 px-6 rounded-lg ${
                pathname === "/Chats"
                  ? "bg-[#dd2525] text-white"
                  : " text-zinc-600 dark:text-white"
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

            {
              //* Theme switch
            }

            <ThemeSwitch />

            {
              //* Responsive nav bar
            }

            <Dropdown
              showArrow
              backdrop="blur"
              classNames={{
                base: "before:bg-default-200", // change arrow background
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
                  className={`${
                    pathname === "/posts"
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
                  className={`${
                    pathname === "/chats"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                  }`}
                  onClick={() => setIsChatOpen(true)}
                >
                  <Link href="/chats" className="flex items-center gap-2">
                    <ChatIcon className="w-5 h-5" />
                    <span className="text-sm ">Chat</span>
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="Friends"
                  className={`${
                    pathname === "/friends"
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
                  className={`${
                    pathname === "/dashboard"
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
                  className={`${
                    pathname === "/chats"
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
                  className={`${
                    pathname === "/friends"
                      ? "bg-danger-600 text-white"
                      : "fill-zinc-600 dark:fill-slate-300"
                  }`}
                >
                  <Link href="/saves" className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5" />
                    <span className="text-sm ">Saves</span>
                  </Link>
                </DropdownItem>

                <DropdownItem
                  key="Logout"
                  onClick={() => handleLogout()}
                >
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
