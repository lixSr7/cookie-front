"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

//? Icons
import {
  PieChart as ChartIcon,
  Users as UsersIcon,
  User as UserIcon,
  MessageCircle as MessageIcon,
  Image as PictureIcon,
  ArrowLeft,
} from "@geist-ui/icons";

//? Components
import Link from "next/link";
import { Avatar } from "@nextui-org/react";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <aside className="h-screen">
      <nav className="flex flex-col h-full bg-white border-r shadow-sm">
        <div className="flex items-center justify-between p-4 pb-2">
          {/* <img
            src=""
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          /> */}
          <button
            onClick={toggleExpanded}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ArrowLeft /> : <ArrowLeft />}
          </button>
        </div>

        <ul className="flex flex-col gap-4 p-3">
          <li>
            <Link
              className={`flex gap-4 items-center py-3 px-6 rounded-md  ${
                pathname === "/admin" && " bg-blue-500 text-white"
              }`}
              href="/admin"
            >
              <ChartIcon className="w-6 h-6 opacity-80" />
              <span className={`${expanded ? "" : "hidden"}`}>Analitycs</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex gap-4 items-center py-3 px-6 rounded-md  ${
                pathname === "/admin/users" && " bg-blue-500 text-white"
              }`}
              href="/admin/users"
            >
              <UsersIcon className="w-6 h-6 " />
              <span className={`${expanded ? "" : "hidden"}`}>Users</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex gap-4 items-center py-3 px-6 rounded-md  ${
                pathname === "/admin/chats" && " bg-blue-500 text-white"
              }`}
              href="/admin/chats"
            >
              <MessageIcon className="w-6 h-6 " />
              <span className={`${expanded ? "" : "hidden"}`}>Chats</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex gap-4 items-center py-3 px-6 rounded-md  ${
                pathname === "/admin/posts" && " bg-blue-500 text-white"
              }`}
              href="/admin/posts"
            >
              <PictureIcon className="w-6 h-6 " />
              <span className={`${expanded ? "" : "hidden"}`}>Posts</span>
            </Link>
          </li>
        </ul>

        <div className="flex justify-center p-3 border-t">
          <Avatar
            color="primary"
            isBordered
            radius="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026302d"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Alexis Gonzales</h4>
              <span className="text-xs text-gray-600">ALexis@gamil.com</span>
            </div>
            <UserIcon size={20} />
          </div>
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
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
