"use client";
import { Avatar, Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tabs, Tab, Card, CardBody, Image, Skeleton, ScrollShadow, CardHeader, Divider, Link, CardFooter, } from "@nextui-org/react";
import { FaSave, FaSearch, FaEnvelope, FaChartLine, FaBell, FaPlus, FaWrench, } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function ProfileUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [profile, setProfile] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setId(decodedToken.id);
      setProfilePic(decodedToken.image.secure_url);
      getProfile(storedToken).then((data) => setProfile(data));
    }
  }, []);
  const getProfile = async (token: string) => {
    try {
      const response = await fetch(
        "https://co-api-vjvb.onrender.com/api/profile",
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
        console.log('user', data)
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
    }
  };

  return (
    <>
      <div>
        <button onClick={onOpen} className="flex flex-col items-center justify-center gap-0 h-max" >
          Profile
        </button>
        <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange} size="xl" backdrop="blur" placement="center" >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader></ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center pt-10">
                  <ScrollShadow
                    hideScrollBar
                    className="w-full h-full overflow-y-auto flex flex-col m-auto"
                  >
                    <div className="flex flex-col items-center w-full h-full">
                      <div className="flex flex-col items-center w-full h-max">
                        <Image className="w-[150px] h-[150px] rounded-full border-1.5" isBlurred src={profilePic} />
                        <p className="m-0 text-2xl font-bold">
                          {profile.fullname}
                        </p>
                        <p className="text-xs text-gray-300">
                          @{profile.username}
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
                            <Card className="max-w-[400px]">
                              <CardHeader className="flex gap-3">
                                <Image
                                  alt="nextui logo"
                                  height={40}
                                  radius="sm"
                                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                                  width={40}
                                />
                                <div className="flex flex-col">
                                  <p className="text-md">NextUI</p>
                                  <p className="text-small text-default-500">nextui.org</p>
                                </div>
                              </CardHeader>
                              <Divider />
                              <CardBody>
                                <p>Make beautiful websites regardless of your design experience.</p>
                              </CardBody>
                              <Divider />
                              <CardFooter>
                                <Link
                                  isExternal
                                  showAnchorIcon
                                  href="https://github.com/nextui-org/nextui"
                                >
                                  Visit source code on GitHub.
                                </Link>
                              </CardFooter>
                            </Card>
                          </div>
                        </Tab>
                        <Tab key="save" title="Save">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                          </div>
                        </Tab>
                        <Tab key="shared" title="Shared">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                          </div>
                        </Tab>
                      </Tabs>
                    </div>
                  </ScrollShadow>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div >
    </>
  );
}

export default ProfileUser;
