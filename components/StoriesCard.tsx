'use client';
import { useEffect, useRef, useState } from "react";
import { Card, Image, CardFooter, User, ScrollShadow, Modal, useDisclosure, Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, CardBody, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Spinner, Skeleton } from "@nextui-org/react";
import { UploadCloud as CloudIcon, Trash2 as TrashIcon, Heart as HeartIcon, Plus as PlusIcon } from "@geist-ui/icons";
import { TbCookieFilled } from "react-icons/tb";
import socket from "@/app/config/socketConfig";
import { jwtDecode } from "jwt-decode";

function StoriesCard() {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [myStories, setMyStories] = useState<any[]>([]);
  const [otherStories, setOtherStories] = useState<any[]>([]);
  const [selectedUserStories, setSelectedUserStories] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [viewers, setViewers] = useState<any[]>([]);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isViewersModalOpen, setIsViewersModalOpen] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isStoryOpen, onOpen: onStoryOpen, onOpenChange: onStoryOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<{ id: string }>(storedToken);
      setUserId(decodedToken.id);
      getMyStories(storedToken);
      getOtherStories(storedToken);
      getMyProfile(storedToken);
    }
  }, []);

  useEffect(() => {
    if (userId && token) {
      getMyStories(token);
      getOtherStories(token);
    }
  }, [userId, token]);

  useEffect(() => {
    socket.connect();

    socket.on("storyCreated", async () => {
      await getMyStories(token);
      await getOtherStories(token);
    });

    socket.on('storyDeleted', async () => {
      await getMyStories(token);
      await getOtherStories(token);
    });

    return () => {
      socket.off("storyCreated");
      socket.off('storyDeleted');
    };
  }, [token]);

  useEffect(() => {
    if (selectedUserStories.length === 0) return;

    const interval = setInterval(async () => {
      if (isViewersModalOpen) {
        return;
      }

      const nextSlide = (currentSlide + 1) % selectedUserStories.length;

      if (selectedUserStories[nextSlide].userId._id !== userId && selectedUserStories[nextSlide].isViewed.length === 0) {
        await viewStories(selectedUserStories.map(story => story._id));
      }

      if (nextSlide === 0) {
        onStoryOpenChange();
        setSelectedUserStories([]);
      }
      setCurrentSlide(nextSlide);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUserStories, currentSlide, onStoryOpenChange, userId, token, isViewersModalOpen]);

  useEffect(() => {
    const fetchViewers = async () => {
      if (selectedUserStories.length > 0) {
        const viewersData = await getStoryViewers(selectedUserStories[currentSlide]._id);
        setViewers(viewersData);
      }
    };

    fetchViewers();
  }, [selectedUserStories, currentSlide, token]);

  const getMyStories = async (token: string) => {
    try {
      const response = await fetch("https://rest-api-cookie-u-c.onrender.com/api/stories/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMyStories(data);
      } else {
        throw new Error("Error fetching stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderViewersDropdown = () => (
    <Dropdown onOpenChange={(open) => setIsViewersModalOpen(open)} isOpen={isViewersModalOpen} >
      <DropdownTrigger>
        Viewers
      </DropdownTrigger>
      <DropdownMenu aria-label="Viewers" variant="faded" className="w-52">
        {viewers.map((viewer, index) => (
          <DropdownItem key={index}>
            {viewer.fullname} (@{viewer.username})
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  const deleteStory = async (storyId: string) => {
    try {
      const response = await fetch(`https://rest-api-cookie-u-c.onrender.com/api/stories/${storyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Story deleted:', data);
        onStoryOpenChange();
      } else {
        console.error("Error deleting story:", await response.text());
        throw new Error("Error deleting story");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      throw new Error("Error deleting story");
    }
  };

  const viewStories = async (storyIds: string[]) => {
    try {
      await Promise.all(storyIds.map(async (storyId) => {
        const response = await fetch(`https://rest-api-cookie-u-c.onrender.com/api/stories/${storyId}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Story viewed:', data);
        } else {
          console.error("Error viewing story:", await response.text());
          throw new Error("Error viewing story");
        }
      }));
    } catch (error) {
      console.error("Error viewing stories:", error);
      throw new Error("Error viewing stories");
    }
  };

  const getStoryViewers = async (storyId: string) => {
    try {
      const response = await fetch(`https://rest-api-cookie-u-c.onrender.com/api/stories/${storyId}/view`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Story viewers:', data);
        return data;
      } else {
        console.error("Error fetching story viewers:", await response.text());
        throw new Error("Error fetching story viewers");
      }
    } catch (error) {
      console.error("Error fetching story viewers:", error);
      throw new Error("Error fetching story viewers");
    }
  };

  const getMyProfile = async (token: string) => {
    try {
      const response = await fetch("https://rest-api-cookie-u-c.onrender.com/api/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('my profile:', data);
        setMyProfile(data);
      } else {
        console.error("Error fetching profile:", await response.text());
        throw new Error("Error fetching profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error("Error fetching profile");
    }
  };

  const handleCreateStory = async () => {
    if (!content && !image) {
      alert("Please provide content or an image.");
      return;
    }

    const formData = new FormData();
    if (content) {
      formData.append("content", content);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("https://rest-api-cookie-u-c.onrender.com/api/stories/", {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Story created:', data);
        onOpenChange();
      } else {
        console.error("Error creating story:", await response.text());
        throw new Error("Error creating story");
      }
    } catch (error) {
      console.error("Error creating story:", error);
      throw new Error("Error creating story");
    }
  };

  const getOtherStories = async (token: string) => {
    try {
      const response = await fetch("https://rest-api-cookie-u-c.onrender.com/api/stories/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOtherStories(data);
      } else {
        throw new Error("Error fetching stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const combineAndFilterStories = (myStories: any[], otherStories: any[]) => {
    const allStories = [...myStories, ...otherStories];
    const latestStoriesByUser: { [key: string]: any } = {};

    allStories.forEach(story => {
      const userId = story.userId._id;
      if (!latestStoriesByUser[userId] || new Date(story.createdAt) > new Date(latestStoriesByUser[userId].createdAt)) {
        latestStoriesByUser[userId] = story;
      }
    });

    return Object.values(latestStoriesByUser);
  };

  const handleStoryOpen = (userId: string) => {
    const userStories = [...myStories, ...otherStories].filter(story => story.userId._id === userId);
    setSelectedUserStories(userStories);
    onStoryOpen();
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) =>
      (prevSlide - 1 + selectedUserStories.length) % selectedUserStories.length
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      (prevSlide + 1) % selectedUserStories.length
    );
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    let interval = Math.floor(seconds / 3600); // Calcular en horas
    if (interval >= 1) {
      return `hace ${interval} ${interval === 1 ? 'hora' : 'horas'}`;
    }

    interval = Math.floor(seconds / 60); // Calcular en minutos
    if (interval >= 1) {
      return `hace ${interval} ${interval === 1 ? 'minuto' : 'minutos'}`;
    }

    return `hace ${Math.floor(seconds)} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  };

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  const filteredStories = combineAndFilterStories(myStories, otherStories);

  return (
    <div className="max-w-[22em] min-[1920px]:max-w-[25em] max-h-[45%] min-h-[45%] h-full flex flex-row overflow-x-auto">
      <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
        <div className="w-full h-full p-1 m-0 flex gap-2">
          <div className="flex flex-row space-x-2 min-w-fit">
            {loading ? (
              <div className="flex flex-row gap-2">
                <Skeleton className="w-40 min-h-full rounded-lg" />
                <Skeleton className="w-40 min-h-full rounded-lg" />
                <Skeleton className="w-40 min-h-full rounded-lg" />
              </div>
            ) : (
              <>
                <Card className="w-40 min-h-full p-0 m-0 relative flex-shrink-0 flex justify-center items-center" isPressable onPress={onOpen}>
                  <CardBody style={{ backgroundImage: `url(${myProfile?.image?.secure_url})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(3px)', backgroundRepeat: 'no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <PlusIcon className="stroke-white w-20 h-20" />
                  </CardBody>
                  <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p>CREATE STORY</p>
                  </CardFooter>
                </Card>
                {filteredStories.map((story, index) => (
                  <Card key={index} className="w-40 min-h-full p-0 m-0 relative flex-shrink-0" isPressable onPress={() => handleStoryOpen(story.userId._id)}>
                    {story.image ? (
                      <Image removeWrapper className="z-0 w-full h-full object-cover" style={{ filter: "blur(3px)", backgroundColor: "#000", opacity: 0.5 }} src={story.image.secure_url} />
                    ) : (
                      <div className="z-0 w-full h-full flex items-center justify-center" style={{ filter: "blur(3px)", backgroundColor: "#dd2525", opacity: 0.5 }}>
                        <p className="text-white text-center">{story.content}</p>
                      </div>
                    )}
                    {story.userId._id !== userId && (
                      <TbCookieFilled className="text-[#fff] bg-[#dd2525] rounded-full text-2xl w-6 h-6 flex justify-center items-center" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, }} />
                    )}
                    {story.userId._id === userId && (
                      <div className="text-[#fff] bg-[#dd2525] text-2xl p-2 w-6 h-6 rounded-full flex justify-center items-center" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, }} >
                        <span className="text-xs">{story.isViewed.length}</span>
                      </div>
                    )}
                    <CardFooter>
                      <div className="overflow-x-auto">
                        <User name={truncateText(story.userId._id === userId ? "Tu" : story.userId.fullname, 8)} description={`@${story.userId.username}`} avatarProps={{ src: story.userId.image?.secure_url }} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </ScrollShadow>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Story
              </ModalHeader>
              <ModalBody>
                <Input required label="Content" type="text" value={content} onChange={(e) => setContent(e.target.value)} fullWidth />

                <label className={`flex flex-col items-center justify-center overflow-hidden border-2 border-dashed cursor-pointer rounded-xl h-60`} htmlFor="imageInput" >
                  <input accept="image/*" className="hidden" id="imageInput" type="file" onChange={handleImageChange} />
                  {previewImage ? (
                    <Image alt="Story Image" className="object-cover w-full h-full" src={previewImage} />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                      <CloudIcon className="w-20 h-20 stroke-[#dd2525]" />
                    </div>
                  )}
                </label>
              </ModalBody>
              <ModalFooter>
                <Button className="text-[#dd2525] bg-transparent" onPress={onClose}>
                  Close
                </Button>
                <Button className="bg-[#dd2525]" onPress={handleCreateStory}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isStoryOpen} onOpenChange={onStoryOpenChange} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col justify-start items-start gap-1">
            {selectedUserStories.length > 0 && (
              <div className="flex justify-between items-center gap-2 w-full p-2">
                <User name={selectedUserStories[0].userId._id === userId ? "TÚ" : selectedUserStories[0].userId.fullname} description={timeAgo(selectedUserStories[currentSlide]?.createdAt)} avatarProps={{ src: selectedUserStories[0].userId.image?.secure_url }} />
                {selectedUserStories[0].userId._id === userId && (
                  <Button isIconOnly aria-label="Delete Post" variant="ghost" onClick={() => deleteStory(selectedUserStories[currentSlide]._id)}>
                    <TrashIcon className="w-5 h-5 opacity-65" />
                  </Button>
                )}
              </div>
            )}
          </ModalHeader>

          <ModalBody className="min-h-60 relative min-w-80 h-full w-full overflow-hidden">
            {selectedUserStories.length > 0 && (
              <div className="relative min-w-80 min-h-60 w-full h-full flex flex-col items-center justify-center">
                <p className="text-xs text-left self-start">{selectedUserStories[currentSlide].content}</p>
                {/* Button for previous slide */}
                <button onClick={goToPreviousSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10">
                  &#10094;
                </button>
                <div className="relative min-w-80 min-h-60 w-full h-full">
                  {selectedUserStories.map((story, index) => (
                    <div key={index} className="absolute min-w-80 min-h-60 w-full h-full flex items-center justify-center rounded-xl" style={{ opacity: index === currentSlide ? 1 : 0, transition: 'opacity 1s ease-in-out', zIndex: index === currentSlide ? 1 : 0, backgroundColor: story.image ? 'transparent' : "#dd2525" }}>
                      {story.image ? (
                        <Image className="w-full h-full object-cover" src={story.image.secure_url} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-xl">
                          <p className="text-white text-center">{story.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Button for next slide */}
                <button onClick={goToNextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10">
                  &#10095;
                </button>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-between items-center gap-2 w-full p-2">
              {renderViewersDropdown()}
              <Button isIconOnly aria-label="Like" color={isLiked ? "danger" : "default"} >
                <HeartIcon className={`w-6 h-6 cursor-pointer ${isLiked ? "fill-white" : "opacity-60"}`} />
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default StoriesCard;