"use client";
import {
  Avatar,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Card,
  CardBody,
  Image,
  Skeleton,
} from "@nextui-org/react";
import {
  FaSave,
  FaSearch,
  FaEnvelope,
  FaChartLine,
  FaBell,
  FaPlus,
  FaWrench,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { userProfile } from "@/types/Users";
import PageChat from "../chat/chatModal";

function PROFILE() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [token, setToken] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [profile, setProfile] = useState<userProfile | null>(null);
  const [profilePic, setProfilePic] = useState<string>("");
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<any>(storedToken);
      setId(decodedToken.id);
      setProfilePic(decodedToken.image.secure_url);
      getProfile(storedToken).then((data) => setProfile(data));
    }
  }, []);

  const getProfile = async (token: string): Promise<userProfile> => {
    try {
      const response = await fetch(
        "https://co-api-vjvb.onrender.com/api/profile/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data: userProfile = await response.json();
        return data;
      } else {
        console.error("Error al obtener perfil:", await response.text());
        throw new Error(
          "Error interno del servidor. Intente nuevamente más tarde."
        );
      }
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      alert("Error al obtener el perfil. Intente nuevamente más tarde.");
      return Promise.reject(error); // Maneja el error adecuadamente
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://co-api-vjvb.onrender.com/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        console.error("Error logout in:", await response.text());
        throw new Error("logout failed");
      }
    } catch (error) {
      // console.log("Logout error:", error);
      alert("Error al cerrar sesión. Intente nuevamente.");
    }
  };

  const handleOpenChat = (): void => {
    setIsChatOpen(true);
  };

  const handleCloseChat = (): void => {
    setIsChatOpen(false);
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <footer className="fixed w-1/2 bg-red-500 rounded-lg shadow-md bottom-2 h-14">
        <div className="flex items-center justify-between w-full h-full p-1">
          <Dropdown backdrop="blur" className="text-white bg-red-500">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                color="default"
                name="Profile Pic"
                size="sm"
                className="ml-1 transition-transform"
                fallback={<FaPlus />}
                src={profilePic}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="shadow">
              <DropdownItem
                key="save"
                startContent={<FaSave />}
                textValue="Save"
              >
                Save
              </DropdownItem>
              <DropdownItem
                key="search"
                startContent={<FaSearch />}
                textValue="Search"
              >
                Search
              </DropdownItem>
              <DropdownItem
                key="messages"
                startContent={<FaEnvelope />}
                onClick={handleOpenChat}
                textValue="Messages"
              >
                Messages
              </DropdownItem>
              <DropdownItem
                key="stats"
                startContent={<FaChartLine />}
                textValue="Stats"
              >
                Stats
              </DropdownItem>
              <DropdownItem
                key="notifi"
                startContent={<FaBell />}
                textValue="Notifications"
              >
                Notifications
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div>
            <Button
              onPress={onOpen}
              className="flex flex-col items-center justify-between gap-0 bg-red-500 h-max"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 p-0 m-0 font-extrabold text-white"
              >
                <path d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
              <span className="p-0 m-0 text-xs font-bold text-white">
                PROFILE
              </span>
            </Button>
            <Modal
              isOpen={isOpen}
              scrollBehavior="inside"
              onOpenChange={onOpenChange}
              size="xl"
              backdrop="blur"
              placement="center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader></ModalHeader>
                    <ModalBody className="flex flex-col items-center justify-center pt-10">
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-max">
                          <Image
                            className="w-[150px] h-[150px] rounded-full border-1.5"
                            isBlurred
                            src={profilePic}
                          />
                          <p className="m-0 text-2xl font-bold">
                            {profile?.fullname}
                          </p>
                          <p className="text-xs text-gray-300">
                            @{profile?.username}
                          </p>
                          <button className="absolute top-10 left-10">
                            <FaWrench />
                          </button>
                        </div>
                        <ButtonGroup className="mb-10">
                          <Button>Follow</Button>
                          <Button>Followers</Button>
                          <Button>Friends</Button>
                        </ButtonGroup>
                        <Tabs aria-label="Options">
                          <Tab key="posts" title="Posts">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {/* Placeholder images */}
                              {Array(4)
                                .fill(null)
                                .map((_, index) => (
                                  <Card
                                    shadow="sm"
                                    isPressable
                                    key={index}
                                    onPress={() => console.log("item pressed")}
                                  >
                                    <CardBody className="p-0 overflow-visible">
                                      <Image
                                        shadow="sm"
                                        radius="lg"
                                        width="100%"
                                        src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                                        className="w-full object-cover h-[140px]"
                                      />
                                    </CardBody>
                                  </Card>
                                ))}
                            </div>
                          </Tab>
                          <Tab key="save" title="Save">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              <Card
                                shadow="sm"
                                isPressable
                                onPress={() => console.log("item pressed")}
                              >
                                <CardBody className="p-0 overflow-visible">
                                  <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                                    className="w-full object-cover h-[140px]"
                                  />
                                </CardBody>
                              </Card>
                            </div>
                          </Tab>
                          <Tab key="shared" title="Shared">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              <Card
                                shadow="sm"
                                isPressable
                                onPress={() => console.log("item pressed")}
                              >
                                <CardBody className="p-0 overflow-visible">
                                  <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                                    className="w-full object-cover h-[140px]"
                                  />
                                </CardBody>
                              </Card>
                            </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <Dropdown backdrop="blur" className="text-white bg-red-500">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                color="default"
                name="Profile Pic"
                size="sm"
                className="mr-1 transition-transform"
                src={profilePic}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="shadow">
              <DropdownItem key="logout" onClick={handleLogout}>
                Log Out
              </DropdownItem>
              <DropdownItem key="profile" className="gap-2 h-14">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{profile?.email}</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </footer>

      <PageChat isOpen={isChatOpen} onClose={handleCloseChat} />
    </main>
  );
}

export default PROFILE;
