"use client";
import { Card, CardBody, Badge, Skeleton, User, Avatar } from "@nextui-org/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MessageSquare as MessageIcon } from "@geist-ui/icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "@/app/config/socketConfig";

interface Friend {
  _id: string;
  fullname: string;
  username: string;
  image?: {
    secure_url: string;
  };
  sesion: string;
  verified?: string;
  notifications: string[];
}

function FriendsCard() {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<{ id: string }>(storedToken);
      setUserId(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchFriends();
    }
  }, [userId, token]);

  useEffect(() => {
    socket.connect();

    socket.on("userFollowed", async () => {
      await fetchFriends();
    });

    socket.on("userUnfollowed", async () => {
      await fetchFriends();
    });

    return () => {
      socket.off("userFollowed");
      socket.off("userUnfollowed");
    };
  }, [userId, token]);

  const fetchFriends = async () => {
    try {
      const url = `https://rest-api-cookie-u-c.onrender.com/api/users/following/${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data: Friend[] = await response.json();
        setFriends(data);
        setLoading(false);
      } else {
        console.error("Error fetching friends");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setLoading(false);
    }
  };

  const userSkeleton = () => (
    <div className="max-w-full w-full flex items-center gap-4 mt-2">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );

  const skeleton = () => (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-2 px-6 py-5">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex justify-between items-center w-full" >
              {userSkeleton()}
            </div>
          ))}
      </CardBody>
    </Card>
  );

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] min-h-[100%] max-h-[100%] flex flex-col gap-6">
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-full gap-3">
          {Array(1)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="w-full">
                {skeleton()}
              </div>
            ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardBody className="flex flex-col gap-6 px-6 py-5">
            {friends.slice(0, 8).map((friend) => (
              <div key={friend._id} className="flex justify-between items-center w-full" >
                <div className="flex items-center gap-2">
                  {friend?.sesion === "true" ? (
                    <Badge color="success" content={''} shape="circle" size="sm">
                      <Avatar size="md" src={friend.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"} />
                    </Badge>
                  ) : (
                    <Badge color="default" content={''} shape="circle" size="sm">
                      <Avatar size="md" src={friend.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"} />
                    </Badge>
                  )}
                  <div className="flex flex-col">
                    <strong className="text-base m-0 flex justify-center items-center">
                      {(() => {
                        const words = friend.fullname.split(" ");
                        if (words.length === 4) {
                          return `${words[0]} ${words[2]}`;
                        } else if (words.length === 3) {
                          return `${words[0]} ${words[1]}`;
                        } else {
                          return friend.fullname;
                        }
                      })()}
                      <span className="ml-2">
                        {friend.verified === 'true' && (
                          <RiVerifiedBadgeFill className="text-xl text-[#dd2525]" />
                        )}
                      </span>
                    </strong>
                    <span className="text-xs text-gray-400">
                      @{friend.username}
                    </span>
                  </div>
                </div>
                <button>
                  <MessageIcon size={25} />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </article>
  );
}

export default FriendsCard;
