'use client';
import { useEffect, useRef, useState } from "react";
import { Card, Image, CardFooter, User, ScrollShadow, Modal, useDisclosure, Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Input } from "@nextui-org/react";
import { Plus as PlusIcon } from "@geist-ui/icons";
import { TbCookieFilled } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";
import socket from "@/app/config/socketConfig";
import { UploadCloud as CloudIcon } from "@geist-ui/icons";

function StoriesCard() {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [myStories, setMyStories] = useState<any[]>([]);
  const [otherStories, setOtherStories] = useState<any[]>([]);
  const [selectedUserStories, setSelectedUserStories] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isStoryOpen, onOpen: onStoryOpen, onOpenChange: onStoryOpenChange } = useDisclosure();

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

    socket.on("userUpdate", async () => {
      await getMyStories(token);
      await getOtherStories(token);
    });

    return () => {
      socket.off("userUpdate");
    };
  }, [token]);

  useEffect(() => {
    if (selectedUserStories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % selectedUserStories.length;
        if (nextSlide === 0) {
          onStoryOpenChange();
          setSelectedUserStories([]);
        }
        return nextSlide;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUserStories, onStoryOpenChange]);

  const getMyStories = async (token: string) => {
    try {
      const response = await fetch("https://cookie-rest-api-8fnl.onrender.com/api/stories/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('my stories:', data);
        setMyStories(data);
      } else {
        console.error("Error fetching stories:", await response.text());
        throw new Error("Error fetching stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw new Error("Error fetching stories");
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
      const response = await fetch("https://cookie-rest-api-8fnl.onrender.com/api/stories/", {
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
      const response = await fetch("https://cookie-rest-api-8fnl.onrender.com/api/stories/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('other stories:', data);
        setOtherStories(data);
      } else {
        console.error("Error fetching stories:", await response.text());
        throw new Error("Error fetching stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw new Error("Error fetching stories");
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
            <Card className="w-44 min-h-full p-0 m-0 relative flex-shrink-0 bg-[#dd2525] flex justify-center items-center" isPressable onPress={onOpen}>
              <PlusIcon className=" stroke-white w-20 h-20" />
              <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p>CREATE STORY</p>
              </CardFooter>
            </Card>
            {filteredStories.map((story, index) => (
              <Card key={index} className="w-44 min-h-full p-0 m-0 relative flex-shrink-0" isPressable onPress={() => handleStoryOpen(story.userId._id)}>
                {story.image ? (
                  <Image removeWrapper className="z-0 w-full h-full object-cover" style={{ filter: "blur(3px)", backgroundColor: "#000", opacity: 0.5 }} src={story.image.secure_url} />
                ) : (
                  <div className="z-0 w-full h-full flex items-center justify-center" style={{ filter: "blur(3px)", backgroundColor: "#dd2525", opacity: 0.5 }}>
                    <p className="text-white text-center">{story.content}</p>
                  </div>
                )}
                <TbCookieFilled className="text-[#fff] bg-[#dd2525] rounded-full text-2xl" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, }} />
                <CardFooter>
                  <div className="overflow-x-auto">
                    <User name={truncateText(story.userId.fullname, 8)} description={`@${story.userId.username}`} avatarProps={{ src: story.userId.image?.secure_url }} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
                  </div>
                </CardFooter>
              </Card>
            ))}
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
              <User name={selectedUserStories[0].userId._id === userId ? "TÚ" : selectedUserStories[0].userId.fullname} description={timeAgo(selectedUserStories[currentSlide]?.createdAt)} avatarProps={{ src: selectedUserStories[0].userId.image?.secure_url }} />
            )}
          </ModalHeader>
          <ModalBody className="min-h-60 relative min-w-80 h-full w-full overflow-hidden">
            {selectedUserStories.length > 0 && (
              <div className="relative min-w-80 min-h-60 w-full h-full flex items-center justify-center">
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
            like report
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default StoriesCard;