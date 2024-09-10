"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ThemeSwitch } from "../../../components/theme-switch";

//? Icons
import {
  PieChart as ChartIcon,
  Users as UsersIcon,
  User as UserIcon,
  Image as PictureIcon,
  Menu as MenuIcon,
  ArrowLeft
} from "@geist-ui/icons";

//? Components
import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";

import { userToken } from "@/types/Users";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<userToken | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const decodeToken: userToken = jwtDecode(storedToken);

      setUser(decodeToken);
    }
  }, []);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <aside className="h-screen">
      <nav className={`flex flex-col h-full bg-white dark:bg-[#111111] border-t dark:border-gray-700 shadow-sm ${!expanded ? "items-center" : ""}`}>
        <div className="flex items-center justify-between p-4 pb-2 mx-4">
          <button className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleExpanded} >
            {expanded ? <MenuIcon /> : <MenuIcon />}
          </button>
        </div>

        <ul className={`flex flex-col gap-4 p-3 ${!expanded ? "items-center" : ""}`}>
          <li>
            <Link className={`flex gap-4 items-center py-3 px-6 rounded-md ${pathname === "/admin" && "bg-blue-500 text-white dark:bg-blue-600"}`} href="/admin" >
              <ChartIcon className="w-6 h-6 opacity-80" />
              <span className={`${expanded ? "" : "hidden"}`}>Analytics</span>
            </Link>
          </li>
          <li>
            <Link className={`flex gap-4 items-center py-3 px-6 rounded-md ${pathname === "/admin/users" && "bg-blue-500 text-white dark:bg-blue-600"}`} href="/admin/users" >
              <UsersIcon className="w-6 h-6" />
              <span className={`${expanded ? "" : "hidden"}`}>Users</span>
            </Link>
          </li>
          <li>
            <Link className={`flex gap-4 items-center py-3 px-6 rounded-md ${pathname === "/admin/posts" && "bg-blue-500 text-white dark:bg-blue-600"}`} href="/admin/posts" >
              <PictureIcon className="w-6 h-6" />
              <span className={`${expanded ? "" : "hidden"}`}>Posts</span>
            </Link>
          </li>
        </ul>

        <div className="flex justify-center p-3 border-t dark:border-gray-700">
          <Avatar color="primary" size="lg" src={user?.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"} />
          <div className={` flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"} `} >
            <div className="leading-4">
              <h4 className="font-semibold dark:text-white">
                {user?.fullname}
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
                <span>
                  @{user?.username}
                </span>
                <span className="text-xs text-gray-600 dark:text-[#dd2525] dark:font-bold">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-3 border-t dark:border-gray-700">
          {expanded && (
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-2">
                <Link href="/posts">
                  <button><ArrowLeft /></button>
                </Link>
                <span className="text-sm">Back to Feed</span>
              </div>
              <ThemeSwitch />
            </div>
          )}
          {!expanded && (
            <div className="flex justify-center items-center">
              <ThemeSwitch />
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}) {
  const [expanded] = useState(true);

  return (
    <li className={` relative flex items-center ${expanded ? "justify-start" : "justify-center"} py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group 
        ${active
        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:from-indigo-800 dark:to-indigo-600 dark:text-white"
        : "hover:bg-indigo-50 dark:hover:bg-indigo-800 text-gray-600 dark:text-gray-400"
      } 
    `}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`} >
        {text}
      </span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
      )}

      {!expanded && (
        <div className={` absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 `} >
          {text}
        </div>
      )}
    </li>
  );
}
