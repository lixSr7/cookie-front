import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spinner,
  Image,
  ButtonGroup,
  Tab,
  Tabs,
  Card,
  CardFooter,
  ScrollShadow,
} from "@nextui-org/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

interface OtherProfileUserProps {
  userId: string | null;
  onClose: () => void;
}

const OtherProfileUser: React.FC<OtherProfileUserProps> = ({
  userId,
  onClose,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (userId && token) {
      onOpen();
      getUser(userId, token);
    }
  }, [userId, token, onOpen]);

  const getUser = async (userId: string, token: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/${userId}`,
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

        console.log("user:", data);
        setUser(data);
        setPosts(data.posts);
        setSavedPosts(data.savedPosts);
        setLikes(data.likes);
      } else {
        console.error("Error al obtener el perfil:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const follow = async (userId: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/follow/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
      } else {
        const errorData = await response.json();

        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const unfollow = async (userId: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/unfollow/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
      } else {
        const errorData = await response.json();

        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const addfriend = async (userId: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/addFriend/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
      } else {
        const errorData = await response.json();

        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const removefriend = async (userId: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/removeFriend/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
      } else {
        const errorData = await response.json();

        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size="5xl"
        onClose={onClose}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1 justify-center items-center">
              {user?.fullname}
            </ModalHeader>
            <ModalBody>
              <ScrollShadow
                hideScrollBar
                className="w-full h-full overflow-y-auto flex flex-col m-auto"
              >
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner color="danger" size="lg" />
                  </div>
                ) : (
                  user && (
                    <>
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-max">
                          {user && (
                            <>
                              <Image
                                isBlurred
                                className="w-[150px] h-[150px] rounded-full border-1.5 object-cover"
                                src={user.image?.secure_url}
                              />
                              <p className="m-0 text-2xl font-bold flex justify-center items-center">
                                {user.fullname}{" "}
                                <span className="ml-2">
                                  {user.verified === 'true' && (
                                    <RiVerifiedBadgeFill className="text-2xl text-[#dd2525]" />
                                  )}
                                </span>
                              </p>
                              <p className="text-xs text-gray-300">
                                @{user.username}
                              </p>
                              <p className="text-sm font-bold mt-5">
                                {user.description}
                              </p>
                            </>
                          )}

                          <div className="flex flex-col items-center w-full h-max gap-4">
                            <ButtonGroup size="sm">
                              <Button className="transition-transform transform hover:scale-105 hover:shadow-lg">
                                Following <span>{user.following.length}</span>
                              </Button>
                              <Button className="transition-transform transform hover:scale-105 hover:shadow-lg">
                                Followers <span>{user.followers.length}</span>
                              </Button>
                              <Button className="transition-transform transform hover:scale-105 hover:shadow-lg">
                                Friends <span>{user.friends.length}</span>
                              </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                              <Button
                                className="transition-transform transform hover:scale-105 hover:shadow-lg"
                                color="danger"
                                variant="light"
                              >
                                Follow
                              </Button>
                              <Button
                                className="transition-transform transform hover:scale-105 hover:shadow-lg"
                                color="secondary"
                                variant="light"
                              >
                                Add Friend
                              </Button>
                            </ButtonGroup>
                          </div>

                          <Tabs className="m-2">
                            <Tab key="posts" title="Posts">
                              <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
                                {posts.map((post, index) => (
                                  <Card
                                    key={index}
                                    isFooterBlurred
                                    className="border-none"
                                    radius="lg"
                                  >
                                    {post.image && (
                                      <Image
                                        isZoomed
                                        className="object-cover w-[200px] h-[200px]"
                                        src={post.image}
                                      />
                                    )}
                                    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                      <p className="text-tiny text-white/80">
                                        {post.content}
                                      </p>
                                      <Button
                                        className="text-tiny text-white bg-black/20"
                                        color="default"
                                        radius="lg"
                                        size="sm"
                                        variant="flat"
                                      >
                                        {new Date(
                                          post.createdAt
                                        ).toLocaleDateString()}
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                ))}
                              </div>
                            </Tab>
                            <Tab key="likes" title="Likes">
                              <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
                                {likes.map((like, index) => (
                                  <Card
                                    key={index}
                                    isFooterBlurred
                                    className="border-none"
                                    radius="lg"
                                  >
                                    {like.image && (
                                      <Image
                                        isZoomed
                                        className="object-cover w-[200px] h-[200px]"
                                        src={like.image}
                                      />
                                    )}
                                    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                      <p className="text-tiny text-white/80">
                                        {like.content}
                                      </p>
                                      <Button
                                        className="text-tiny text-white bg-black/20"
                                        color="default"
                                        radius="lg"
                                        size="sm"
                                        variant="flat"
                                      >
                                        {new Date(
                                          like.createdAt
                                        ).toLocaleDateString()}
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                ))}
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </div>
                    </>
                  )
                )}
              </ScrollShadow>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OtherProfileUser;
