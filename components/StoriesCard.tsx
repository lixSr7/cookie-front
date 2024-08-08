'use client';
import { useEffect, useState } from "react";
import { Card, Image, CardFooter, User, ScrollShadow, Modal, useDisclosure, Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Plus as PlusIcon } from "@geist-ui/icons";
import { TbCookieFilled } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";
import socket from "@/app/config/socketConfig";
import { RiVerifiedBadgeFill } from "react-icons/ri";

function StoriesCard() {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [myStories, setMyStories] = useState<any[]>([]);
  const [otherStories, setOtherStories] = useState<any[]>([]);
  const [selectedUserStories, setSelectedUserStories] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isStoryOpen, onOpen: onStoryOpen, onOpenChange: onStoryOpenChange } = useDisclosure();

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
      setCurrentSlide((prevSlide) =>
        (prevSlide + 1) % selectedUserStories.length
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [selectedUserStories]);

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

  const filteredStories = combineAndFilterStories(myStories, otherStories);

  // Function to go to the previous slide
  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) =>
      (prevSlide - 1 + selectedUserStories.length) % selectedUserStories.length
    );
  };

  // Function to go to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      (prevSlide + 1) % selectedUserStories.length
    );
  };

  return (
    <div className="max-w-[22em] min-[1920px]:max-w-[25em] max-h-[45%] min-h-[45%] h-full flex flex-row overflow-x-auto">
      <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
        <div className="w-full h-full p-1 m-0 flex gap-2">
          <div className="flex flex-row space-x-2 min-w-fit">
            <Card className="w-[50%] min-h-full p-0 m-0 relative flex-shrink-0 bg-[#dd2525]" isPressable onPress={onOpen}>
              <PlusIcon className=" stroke-white w-7 h-7" />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <div>
                  <p>CREATE STORY</p>
                </div>
              </CardFooter>
            </Card>
            {filteredStories.map((story, index) => (
              <Card key={index} className="w-[50%] min-h-full p-0 m-0 relative flex-shrink-0" isPressable onPress={() => handleStoryOpen(story.userId._id)}>
                {story.image ? (
                  <Image removeWrapper className="z-0 w-full h-full object-cover" style={{ filter: "blur(3px)", backgroundColor: "#000", opacity: 0.5 }} src={story.image.secure_url} />
                ) : (
                  <div className="z-0 w-full h-full flex items-center justify-center" style={{ filter: "blur(3px)", backgroundColor: "#dd2525", opacity: 0.5 }}>
                    <p className="text-white text-center">{story.content}</p>
                  </div>
                )}
                <TbCookieFilled className="text-[#fff] bg-[#dd2525] rounded-full text-2xl" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, }} />
                <CardFooter>
                  <div>
                    <User name={<div className="flex items-center" style={{ maxWidth: "70px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }} > <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{story.userId.fullname}</span> {story.userId.verified && <RiVerifiedBadgeFill className="text-[#dd2525]" style={{ marginLeft: "5px", flexShrink: 0 }} />} </div>} description={`@${story.userId.username}`} avatarProps={{ src: story.userId.image?.secure_url }} />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </ScrollShadow>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Story
              </ModalHeader>
              <ModalBody>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isStoryOpen} onOpenChange={onStoryOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col justify-start items-start gap-1">
                {selectedUserStories.length > 0 && (
                  <User name={selectedUserStories[0].userId.fullname} description={`@${selectedUserStories[0].userId.username}`} avatarProps={{ src: selectedUserStories[0].userId.image?.secure_url }} />
                )}
              </ModalHeader>
              <ModalBody className="min-h-60 relative min-w-80 h-full w-full overflow-hidden">
                {selectedUserStories.length > 0 && (
                  <div className="relative min-w-80 min-h-60 w-full h-full flex items-center justify-center">
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
                    <button onClick={goToNextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10">
                      &#10095;
                    </button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default StoriesCard;