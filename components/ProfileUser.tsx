"use client";
import { Button, ButtonGroup, Modal, ModalContent, ModalBody, useDisclosure, Tabs, Tab, Card, CardBody, Image, ScrollShadow, CardHeader, Divider, Link, CardFooter, } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

function ProfileUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getMyProfile(token);
      localStorage.setItem('profile', JSON.stringify(user));
    }
  }, [token]);

  const getMyProfile = async (token: string) => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c-p.onrender.com/api/profile",
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
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  return (
    <>
      <div>
        <button onClick={onOpen} className="flex flex-col items-center justify-center gap-0 h-max" >
          Profile
        </button>
        <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange} size="2xl" backdrop="blur" placement="center" >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex flex-col items-center justify-center pt-10 w-full min-h-full">
                  <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto" >
                    <div className="flex flex-col items-center w-full h-full">
                      <div className="flex flex-col items-center w-full h-max">
                        <Image className="w-[150px] h-[150px] rounded-full border-1.5" isBlurred src={user.image.secure_url} />
                        <p className="m-0 text-2xl font-bold">
                          {user.fullname}
                        </p>
                        <p className="text-xs text-gray-300">
                          @{user.username}
                        </p>
                        <p className="text-sm font-bold mt-5">
                          {user.description}
                        </p>
                      </div>
                      <ButtonGroup className="m-2">
                        <Button className="transition-transform transform hover:scale-105 hover:shadow-lg">Follow <span>{user.followers.length}</span></Button>
                        <Button className="transition-transform transform hover:scale-105 hover:shadow-lg">Followers <span>{user.following.length}</span></Button>
                        <Button className="transition-transform transform hover:scale-105 hover:shadow-lg">Friends <span>{user.friends.length}</span></Button>
                      </ButtonGroup>
                      <Tabs className="m-2" aria-label="Options">
                        <Tab key="posts" title="Posts">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                            <Card className="max-w-[400px]">
                              <CardHeader className="flex gap-3">
                                <Image alt="nextui logo" height={40} radius="sm" src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4" width={40} />
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