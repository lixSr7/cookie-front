import { Button, ButtonGroup, Modal, ModalContent, ModalBody, useDisclosure, Tabs, Tab, Card, Image, ScrollShadow, CardHeader, Divider, Link, CardFooter, User as NextUser, Badge, ModalHeader, Input, ModalFooter, Select, SelectItem } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { MdEdit } from "react-icons/md";
import socket from "@/app/config/socketConfig";

function ProfileUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isFollowersOpen, onOpen: onFollowersOpen, onOpenChange: onFollowersOpenChange } = useDisclosure();
  const { isOpen: isFollowingOpen, onOpen: onFollowingOpen, onOpenChange: onFollowingOpenChange } = useDisclosure();
  const { isOpen: isFriendsOpen, onOpen: onFriendsOpen, onOpenChange: onFriendsOpenChange } = useDisclosure();
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [following, setFollowing] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
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
      getFollowers(userId, token);
      getFriends(userId, token);
    }
  }, [token]);

  useEffect(() => {
    socket.connect();

    socket.on('userFollowed', async (data) => {
      await getFollowers(userId, token);
      await getFollowing(userId, token);
    });

    socket.on('userUnfollowed', async (data) => {
      await getFollowers(userId, token);
      await getFollowing(userId, token);
    });

    return () => {
      socket.off('userFollowed');
      socket.off('userUnfollowed');
    };
  }, [userId, token]);

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
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  const getPosts = async (token: string) => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/posts",
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
      const response = await fetch(`https://cookie-rest-api-8fnl.onrender.com/api/users/following/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

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
  }

  const getFollowers = async (userId: string, token: string) => {
    try {
      const response = await fetch(`https://cookie-rest-api-8fnl.onrender.com/api/users/followers/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

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
  }

  const getFriends = async (userId: string, token: string) => {
    try {
      const response = await fetch(`https://cookie-rest-api-8fnl.onrender.com/api/users/friends/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        return data;
      } else {
        const errorData = await response.json();
        console.error("Error fetching friends:", errorData.message);
        throw new Error(errorData.message || "Error fetching friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  const editProfile = async () => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            username,
            email,
            gender,
            phone_number: phoneNumber,
            description,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al editar el perfil:", error);
    }
  };

  const genders = [
    ['male', 'Male'],
    ['female', 'Female'],
    ['not binary', 'Not binary'],
  ]

  const postsWithImages = posts.filter(post => post.userId === userId && post.image);
  const postsWithoutImages = posts.filter(post => post.userId === userId && !post.image);

  return (
    <>
      <div>
        <button onClick={onOpen} className="flex flex-col items-center justify-center gap-0 h-max">
          Profile
        </button>
        <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange} size="5xl" backdrop="blur" placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex flex-col items-center justify-center pt-10 w-full min-h-full">
                  <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
                    <Button className="absolute left-10 top-14 transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onEditOpen}>
                      <MdEdit /> settings
                    </Button>
                    <div className="flex flex-col items-center w-full h-full">
                      <div className="flex flex-col items-center w-full h-max">
                        {user && (
                          <>
                            <Image className="w-[150px] h-[150px] rounded-full border-1.5" isBlurred src={user.image?.secure_url} />
                            <p className="m-0 text-2xl font-bold">{user.fullname}</p>
                            <p className="text-xs text-gray-300">@{user.username}</p>
                            <p className="text-sm font-bold mt-5">{user.description}</p>
                          </>
                        )}
                      </div>
                      <ButtonGroup className="m-2">
                        <Button className="transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onFollowingOpen}>Following <span>{following.length}</span></Button>
                        <Button className="transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onFollowersOpen}>Followers <span>{followers.length}</span></Button>
                        <Button className="transition-transform transform hover:scale-105 hover:shadow-lg" onClick={onFriendsOpen}>Friends <span>{friends.length}</span></Button>
                      </ButtonGroup>
                      <Tabs className="m-2" aria-label="Options">
                        <Tab key="posts" title="Posts">
                          <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
                            {postsWithImages.map((post, index) => (
                              <Card key={index} isFooterBlurred radius="lg" className="border-none">
                                {post.image && (
                                  <Image className="object-cover w-[200px] h-[200px]" src={post.image} />
                                )}
                                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                  <p className="text-tiny text-white/80">{post.content}</p>
                                  <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                            {postsWithoutImages.map((post, index) => (
                              <Card key={index} isFooterBlurred radius="lg" className="border-none">
                                <CardHeader className="w-[200px] h-[200px] flex items-center justify-center">
                                  <p>{post.content}</p>
                                </CardHeader>
                                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                  <p className="text-tiny text-white/80">{post.content}</p>
                                  <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
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
      </div>
      <Modal isOpen={isEditOpen} scrollBehavior="inside" onOpenChange={onEditOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 p-2">
                    <Input type="text" label="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={user.username} />
                    <Input type="text" label="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={user.email} />
                    <Select label="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder={user.gender}>
                      {genders.map((gender, index) => (
                        <SelectItem key={index} value={gender[0]}>{gender[1]}</SelectItem>
                      ))}
                    </Select>
                    <Input type="text" label="phone_number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={user.phone_number} />
                    <div className="col-span-2">
                      <Input type="text" label="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={user.description} />
                    </div>
                  </div>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}> Close </Button>
                <Button color="primary" onPress={editProfile}> Edit </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isFollowingOpen} scrollBehavior="inside" onOpenChange={onFollowingOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                Following
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
                  <div className="flex flex-col w-full gap-6 px-6 py-5">
                    {following.map((following, index) => (
                      <div key={following._id} className="flex justify-between w-full">
                        <NextUser name={following.fullname} description={`@${following.username}`} avatarProps={{ src: following.image?.secure_url || 'https://via.placeholder.com/150', isBordered: true, color: "danger", }} />
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isFollowersOpen} scrollBehavior="inside" onOpenChange={onFollowersOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                Followers
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
                  <div className="flex flex-col w-full gap-6 px-6 py-5">
                    {followers.map((follower, index) => (
                      <div key={follower._id} className="flex justify-between w-full">
                        <NextUser name={follower.fullname} description={`@${follower.username}`} avatarProps={{ src: follower.image?.secure_url || 'https://via.placeholder.com/150', isBordered: true, color: "danger", }} />
                      </div>
                    ))}                  </div>
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isFriendsOpen} scrollBehavior="inside" onOpenChange={onFriendsOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                Friends
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center w-full min-h-full">
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
                  <div className="flex flex-col w-full gap-6 px-6 py-5">
                    {friends.map((friend, index) => (
                      <div key={friend._id} className="flex justify-between w-full">
                        <NextUser name={friend.fullname} description={`@${friend.username}`} avatarProps={{ src: friend.image?.secure_url || 'https://via.placeholder.com/150', isBordered: true, color: "danger", }} />
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileUser; 