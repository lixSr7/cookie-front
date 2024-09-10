import { Button, ButtonGroup, Modal, ModalContent, ModalBody, useDisclosure, Tabs, Tab, Card, Image, ScrollShadow, CardHeader, CardFooter, User as NextUser, ModalHeader, Input, ModalFooter, Pagination, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Settings as MdEdit } from "@geist-ui/icons";

import socket from "@/app/config/socketConfig";

function ProfileUser() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange, onClose: onEditClose, } = useDisclosure();
  const { isOpen: isFollowersOpen, onOpen: onFollowersOpen, onOpenChange: onFollowersOpenChange, } = useDisclosure();
  const { isOpen: isFollowingOpen, onOpen: onFollowingOpen, onOpenChange: onFollowingOpenChange, } = useDisclosure();
  const { isOpen: isFriendsOpen, onOpen: onFriendsOpen, onOpenChange: onFriendsOpenChange, } = useDisclosure();
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [following, setFollowing] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  }, [selectedImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  // Estado de la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<{ id: string }>(storedToken);

      setUserId(decodedToken.id);
      getPosts(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getMyProfile(token);
      getFollowing(userId, token);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getFollowers(userId, token);
      getFriends(userId, token);
      getSavedPosts(token);
    }
  }, [token]);

  useEffect(() => {
    socket.connect();

    socket.on("userFollowed", async (data) => {
      await getFollowers(userId, token);
      await getFollowing(userId, token);
    });

    socket.on("userUnfollowed", async (data) => {
      await getFollowers(userId, token);
      await getFollowing(userId, token);
    });

    socket.on("friendAdded", async (data) => {
      await getFriends(userId, token);
    });

    socket.on("friendRemoved", async (data) => {
      await getFriends(userId, token);
    });

    socket.on("userUpdate", async (data) => {
      await getMyProfile(token);
    });

    return () => {
      socket.off("userFollowed");
      socket.off("userUnfollowed");
      socket.off("friendAdded");
      socket.off("friendRemoved");
      socket.off("userUpdate");
    };
  }, [userId, token]);

  const getMyProfile = async (token: string) => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/profile",
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

        console.log("data:", data);
        setUser(data);
        setLikes(data.likes);
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  const getPosts = async (token: string) => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/posts",
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

        setPosts(data);
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener los posts:", error);
    }
  };

  const getFollowing = async (userId: string, token: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/following/${userId}`,
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

        setFollowing(data);

        return data;
      } else {
        const errorData = await response.json();

        console.error("Error fetching following:", errorData.message);
        throw new Error(errorData.message || "Error fetching following");
      }
    } catch (error) {
      console.error("Error fetching following:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const getFollowers = async (userId: string, token: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/followers/${userId}`,
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

        setFollowers(data);

        return data;
      } else {
        const errorData = await response.json();

        console.error("Error fetching followers:", errorData.message);
        throw new Error(errorData.message || "Error fetching followers");
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const getFriends = async (userId: string, token: string) => {
    try {
      const response = await fetch(
        `https://rest-api-cookie-u-c.onrender.com/api/users/friends/${userId}`,
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

        if (Array.isArray(data)) {
          setFriends(data);

          return data;
        } else {
          console.error("Expected an array but got:", data);
        }
      } else {
        const errorData = await response.json();

        console.error("Error fetching friends:", errorData.message);
        throw new Error(errorData.message || "Error fetching friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const editProfile = async () => {
    try {
      const formData = new FormData();

      if (fullname) formData.append("fullname", fullname);
      if (username) formData.append("username", username);
      if (email) formData.append("email", email);
      if (gender) formData.append("gender", gender);
      if (phoneNumber) formData.append("phone_number", phoneNumber);
      if (description) formData.append("description", description);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/profile",
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
          },
          body: formData,
        }
      );

      if (response.ok) {
        // console.log("Perfil actualizado correctamente");
        onEditClose();
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al editar el perfil:", error);
    }
  };

  const getSavedPosts = async (token: string) => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/posts/save",
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

        // console.log(data);
        setSavedPosts(data);
      } else {
        console.error(
          "Error al obtener las publicaciones guardadas:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error al obtener las publicaciones guardadas:", error);
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

        // console.log(data);
        setFollowers(data);
      } else {
        console.error("Error al des-seguir al usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error al des-seguir al usuario:", error);
    }
  };

  const addFriend = async (userId: string) => {
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

        // console.log(data);
        setFriends(data);
      } else {
        console.error("Error al añadir a amigos:", await response.text());
      }
    } catch (error) {
      console.error("Error al añadir a amigos:", error);
    }
  };

  const removeFriend = async (userId: string) => {
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

        // console.log(data);
        setFriends(data);
      } else {
        console.error("Error al eliminar a amigos:", await response.text());
      }
    } catch (error) {
      console.error("Error al eliminar a amigos:", error);
    }
  };

  const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const logout = async () => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/auth/logout",
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
        console.error("Error al cerrar sesión:", await response.text());
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const changePassword = async () => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/profile/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        onEditClose();
        onClose();
        toast.success(
          "The password has been changed successfully, your session will be closed for security."
        );
        setTimeout(() => {
          logout();
        }, 1500);
      } else {
        console.error("Error al cambiar la contraseña:", await response.text());
        throw new Error("Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
    }
  };

  const postsWithImages = posts.filter(
    (post) => post.userId === userId && post.image
  );

  const postsWithoutImages = posts.filter(
    (post) => post.userId === userId && !post.image
  );

  // Paginación
  const totalFollowingPages = Array.isArray(following)
    ? Math.ceil(following.length / itemsPerPage)
    : 0;
  const currentFollowingData = Array.isArray(following)
    ? following.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : [];

  const totalFollowersPages = Array.isArray(followers)
    ? Math.ceil(followers.length / itemsPerPage)
    : 0;
  const currentFollowersData = Array.isArray(followers)
    ? followers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : [];

  const totalFriendsPages = Array.isArray(friends)
    ? Math.ceil(friends.length / itemsPerPage)
    : 0;
  const currentFriendsData = Array.isArray(friends)
    ? friends.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : [];

  return (
    <>
      <ToastContainer />
      <div>
        <button className="flex flex-col items-center justify-center gap-0 h-max" onClick={onOpen} >
          Profile
        </button>
      </div>

      <Modal backdrop="blur" isOpen={isOpen} placement="center" scrollBehavior="inside" size="5xl" onOpenChange={onOpenChange} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="flex flex-col items-center justify-center pt-10 w-full min-h-full">
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto" >
                  <button className="absolute left-10 top-14 transition-transform transform hover:scale-105" onClick={onEditOpen} >
                    <MdEdit />
                  </button>
                  <div className="flex flex-col items-center w-full h-full">
                    <div className="flex flex-col items-center w-full h-max">
                      {user && (
                        <>
                          <Image className="w-[150px] h-[150px] rounded-full border-1.5 object-cover" src={user.image?.secure_url} />
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
                    </div>
                    <ButtonGroup className="m-2">
                      <Button className="transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onFollowingOpen} >
                        Following <span>{following.length}</span>
                      </Button>
                      <Button className="transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onFollowersOpen} >
                        Followers <span>{followers.length}</span>
                      </Button>
                      <Button className="transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onFriendsOpen} >
                        Friends <span>{friends.length}</span>
                      </Button>
                    </ButtonGroup>
                    <Tabs aria-label="Options" className="m-2">
                      <Tab key="posts" title="Posts">
                        <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
                          {postsWithImages.map((post, index) => (
                            <Card key={index} isFooterBlurred className="border-none" radius="lg" >
                              {post.image && (
                                <Image isZoomed className="object-cover w-[200px] h-[200px]" src={post.image} />
                              )}
                              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                <p className="text-tiny text-white/80">
                                  {post.content}
                                </p>
                                <Button className="text-tiny text-white bg-black/20" color="default" radius="lg" size="sm" variant="flat" >
                                  {new Date(
                                    post.createdAt
                                  ).toLocaleDateString()}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                          {postsWithoutImages.map((post, index) => (
                            <Card key={index} isFooterBlurred className="border-none" radius="lg" >
                              <CardHeader className="w-[200px] h-[200px] flex items-center justify-center">
                                <p>{post.content}</p>
                              </CardHeader>
                              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                <p className="text-tiny text-white/80">
                                  {post.content}
                                </p>
                                <Button className="text-tiny text-white bg-black/20" color="default" radius="lg" size="sm" variant="flat" >
                                  {new Date(
                                    post.createdAt
                                  ).toLocaleDateString()}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </Tab>

                      <Tab key="save" title="Save">
                        <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
                          {savedPosts.map((post, index) => (
                            <Card key={index} isFooterBlurred className="border-none" radius="lg" >
                              {post.image && (
                                <Image isZoomed className="object-cover w-[200px] h-[200px]" src={post.image} />
                              )}
                              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                <p className="text-tiny text-white/80">
                                  {post.content}
                                </p>
                                <Button className="text-tiny text-white bg-black/20" color="default" radius="lg" size="sm" variant="flat" >
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
                            <Card key={index} isFooterBlurred className="border-none" radius="lg" >
                              {like.image && (
                                <Image isZoomed className="object-cover w-[200px] h-[200px]" src={like.image} />
                              )}
                              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                <p className="text-tiny text-white/80">
                                  {like.content}
                                </p>
                                <Button className="text-tiny text-white bg-black/20" color="default" radius="lg" size="sm" variant="flat" >
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
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} scrollBehavior="inside" size="lg" onOpenChange={onEditOpenChange} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                Update Profile
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto" >
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 p-2">
                    <div className="col-span-2 flex justify-center items-center">
                      <input ref={fileInputRef} style={{ display: "none" }} type="file" onChange={handleImageChange} />
                      <button style={{ cursor: "pointer" }} onClick={handleImageClick} >
                        <Image isZoomed alt="Profile Image" className="object-cover w-[150px] h-[150px]" src={previewImage || user.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"} />
                      </button>
                    </div>
                    <div className="col-span-2">
                      <Input label="fullname" placeholder={user.fullname} type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                    </div>
                    <Input label="username" placeholder={user.username} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input label="email" placeholder={user.email} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="relative">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="w-full h-full" variant="flat">
                            {gender || user.gender}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Select Gender">
                          <DropdownItem key="male" onClick={() => handleGenderChange("male")} >
                            Male
                          </DropdownItem>
                          <DropdownItem key="female" onClick={() => handleGenderChange("female")} >
                            Female
                          </DropdownItem>
                          <DropdownItem key="not binary" onClick={() => handleGenderChange("not binary")} >
                            Not Binary
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <Input label="phone_number" placeholder={user.phone_number} type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <div className="col-span-2">
                      <Input label="description" placeholder={user.description} type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="col-span-2 flex justify-center items-center py-5">
                      <p>CHANGE PASSWORD</p>
                    </div>
                    <Input label="old password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <Input label="new password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <div className="col-span-2">
                      <Button className="bg-transparent text-[#dd2525] font-bold" onPress={changePassword} >
                        Change
                      </Button>
                    </div>
                  </div>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button className="text-[#dd2525] bg-transparent font-bold" onPress={onClose}>
                  Close
                </Button>
                <Button className="bg-[#dd2525] text-white font-bold" onClick={editProfile}>
                  save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isFollowingOpen} onOpenChange={onFollowingOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">
            Following
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
            {currentFollowingData.length > 0 ? (
              <>
                <div className="flex flex-col w-full gap-6 px-6 py-5">
                  {currentFollowingData.map((user) => (
                    <div key={user._id} className="flex justify-between w-full">
                      <NextUser key={user._id} avatarProps={{ src: user.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg" }} description={`@${user.username}`} name={
                        <div className="flex items-center" >
                          <span >
                            {(() => {
                              const words = user.fullname.split(" ");
                              if (words.length === 4) {
                                return `${words[0]} ${words[2]}`;
                              } else if (words.length === 3) {
                                return `${words[0]} ${words[1]}`;
                              } else {
                                return user.fullname;
                              }
                            })()}
                          </span>
                          {user.verified === 'true' && (
                            <RiVerifiedBadgeFill className="text-[#dd2525]" style={{ marginLeft: "5px", flexShrink: 0 }} />
                          )}
                        </div>
                      } />
                      <Button className="bg-[#dd2525] text-white font-bold" onClick={() => unfollow(user._id)} >
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No users found.</p>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Pagination color="default" initialPage={1} total={totalFollowingPages} onChange={(page) => setCurrentPage(page)} />
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFollowersOpen} scrollBehavior="inside" onOpenChange={onFollowersOpenChange} >
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">
            Followers
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
            {currentFollowersData.length > 0 ? (
              <>
                <div className="flex flex-col w-full gap-6 px-6 py-5">
                  {currentFollowersData.map((user) => (
                    <div key={user._id} className="flex justify-between w-full">
                      <NextUser key={user._id} avatarProps={{ src: user.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg", }} description={`@${user.username}`} name={
                        <div className="flex items-center" >
                          <span >
                            {(() => {
                              const words = user.fullname.split(" ");
                              if (words.length === 4) {
                                return `${words[0]} ${words[2]}`;
                              } else if (words.length === 3) {
                                return `${words[0]} ${words[1]}`;
                              } else {
                                return user.fullname;
                              }
                            })()}
                          </span>
                          {user.verified === 'true' && (
                            <RiVerifiedBadgeFill className="text-[#dd2525]" style={{ marginLeft: "5px", flexShrink: 0 }} />
                          )}
                        </div>
                      } />
                      <Button className="bg-[#dd2525] text-white font-bold" onClick={() => addFriend(user._id)} >
                        add to friends
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No users found.</p>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Pagination color="default" initialPage={1} total={totalFollowersPages} onChange={(page) => setCurrentPage(page)} />
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFriendsOpen} scrollBehavior="inside" onOpenChange={onFriendsOpenChange} >
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">
            Friends
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
            {currentFriendsData.length > 0 ? (
              <>
                <div className="flex flex-col w-full gap-6 px-6 py-5">
                  {currentFriendsData.map((user) => (
                    <div key={user._id} className="flex justify-between w-full">
                      <NextUser key={user._id} avatarProps={{ src: user.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg" }} description={`@${user.username}`} name={
                        <div className="flex items-center"  >
                          <span >
                            {(() => {
                              const words = user.fullname.split(" ");
                              if (words.length === 4) {
                                return `${words[0]} ${words[2]}`;
                              } else if (words.length === 3) {
                                return `${words[0]} ${words[1]}`;
                              } else {
                                return user.fullname;
                              }
                            })()}
                          </span>
                          {user.verified === 'true' && (
                            <RiVerifiedBadgeFill className="text-[#dd2525]" style={{ marginLeft: "5px", flexShrink: 0 }} />
                          )}
                        </div>
                      } />
                      <Button className="bg-[#dd2525] text-white font-bold" onClick={() => removeFriend(user._id)} >
                        remove friend
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No users found.</p>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Pagination color="default" initialPage={1} total={totalFriendsPages} onChange={(page) => setCurrentPage(page)} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileUser;
