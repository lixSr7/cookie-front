"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Avatar,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
  User,
  Card,
  CardBody,
  ButtonGroup,
} from "@nextui-org/react";
import Link from "next/link";
import {
  MessageCircle as ChatIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  ArrowLeftCircle as CloseIcon,
} from "@geist-ui/icons";
import { TiUserAdd } from "react-icons/ti";
import { RiVerifiedBadgeFill } from "react-icons/ri";

import OtherProfileUser from "./otherProfileUser";
import ProfileUser from "./ProfileUser";
import { ThemeSwitch } from "./theme-switch";

import socket from "@/app/config/socketConfig";
import PageChat from "@/app/chat/chatModal";

interface User {
  _id: string;
  fullname: string;
  username: string;
  image?: { secure_url: string };
  verified?: boolean;
}

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      getAllUsers(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getMyProfile(token);
    }
  }, [token]);

  useEffect(() => {
    socket.connect();

    socket.on("userUpdate", async () => {
      await getMyProfile(token);
      await getAllUsers(token);
    });

    return () => {
      socket.off("userUpdate");
    };
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
        },
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
        },
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

  const getAllUsers = async (token: string) => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/users/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        setUsers(data);
      } else {
        console.error("Error al obtener los usuarios:", await response.text());
        throw new Error("Error al obtener los usuarios");
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw new Error("Error al obtener los usuarios");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredUsers = users.filter(
        (user) =>
          user.fullname.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()),
      );

      setSearchResults(filteredUsers);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleKeyPress = (
    event: KeyboardEvent<HTMLDivElement>,
    callback: () => void,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full h-20 px-4 min-sm:px-8 bottom-6">
        <nav className="flex items-center justify-between flex-grow w-full h-full px-4 bg-white border-2 rounded-lg border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
          <div className="lg:min-w-96">
            <div className="flex items-center justify-start gap-4">
              <Avatar
                color="success"
                size="lg"
                src={
                  user?.image?.secure_url || "https://via.placeholder.com/150"
                }
              />
              <div className="flex flex-col">
                <strong className="text-base m-0 flex justify-center items-center">
                  {user?.fullname}{" "}
                  <span className="ml-2">
                    {user?.verified && (
                      <RiVerifiedBadgeFill className="text-2xl text-[#dd2525]" />
                    )}
                  </span>
                </strong>
                <span className="font-medium text-[#dd2525] text-[70%] m-0">
                  @{user?.username}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between w-full gap-4 max-w-64 max-lg:hidden">
            <Link
              className={`flex items-center gap-2 py-2 px-6 rounded-lg ${
                pathname === "/posts"
                  ? "bg-[#dd2525] text-white"
                  : "text-zinc-600 dark:text-white"
              }`}
              href="/posts"
            >
              {pathname === "/posts" && <HomeIcon />}
              Home
            </Link>

            <ProfileUser />

            <button
              className={`py-2 px-6 rounded-lg ${
                pathname === "/Chats"
                  ? "bg-[#dd2525] text-white"
                  : "text-zinc-600 dark:text-white"
              }`}
              onClick={() => setIsChatOpen(true)}
            >
              {pathname === "/Chats" && <ChatIcon />}
              Chats
            </button>
          </div>

          <div className="flex justify-end gap-4 pl-4 xl:min-w-96">
            <div className="relative">
              <Input
                className="w-full bg-white shadow-sm max-w-44 dark:bg-zinc-900 max-md:hidden"
                placeholder="Search..."
                startContent={<SearchIcon />}
                value={searchQuery}
                onBlur={() => setShowSearchResults(false)}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />
              {showSearchResults && searchResults.length > 0 && (
                <Card
                  className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-[400px]"
                  style={{ maxHeight: "calc(5 * 4rem)" }}
                >
                  <CardBody
                    className="flex flex-col w-full gap-4 px-6 py-5"
                    style={{ overflowY: "auto", scrollbarWidth: "none" }}
                  >
                    {searchResults.slice(0, 5).map((result) => (
                      <div
                        key={result._id}
                        className="flex justify-between w-full border border-gray-800 p-2 rounded-md cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) =>
                          handleKeyPress(e, () => handleUserClick(result._id))
                        }
                        onMouseDown={() => handleUserClick(result._id)}
                      >
                        <User
                          avatarProps={{
                            src:
                              result.image?.secure_url ||
                              "https://via.placeholder.com/150",
                          }}
                          description={`@${result.username}`}
                          name={result.fullname}
                        />
                        <ButtonGroup>
                          <Button color="danger" variant="ghost">
                            <TiUserAdd />
                          </Button>
                        </ButtonGroup>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              )}
            </div>

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
      {isModalVisible && (
        <OtherProfileUser userId={selectedUserId} onClose={closeModal} />
      )}
      <PageChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

export default NavBar;
