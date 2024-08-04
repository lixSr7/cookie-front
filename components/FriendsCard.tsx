'use client';
import { User } from "@nextui-org/react";
import { Card, CardBody, Badge } from "@nextui-org/react";
import { Bell as BellIcon } from "@geist-ui/icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "@/app/config/socketConfig";
import { RiVerifiedBadgeFill } from "react-icons/ri";

interface Friend {
  _id: string;
  fullname: string;
  username: string;
  image?: {
    secure_url: string;
  };
  sesion: string;
  verified?: boolean;
}

function FriendsCard() {
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
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

    socket.on('userFollowed', async (data) => {
      await fetchFriends();
    });

    socket.on('userUnfollowed', async (data) => {
      await fetchFriends();
    });

    return () => {
      socket.off('userFollowed');
      socket.off('userUnfollowed');
    };
  }, [userId, token]);

  const fetchFriends = async () => {
    try {
      const url = `https://cookie-rest-api-8fnl.onrender.com/api/users/following/${userId}`;
      // console.log("Fetching URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data: Friend[] = await response.json();
        // console.log('users:', data);
        setFriends(data);
      } else {
        console.error("Error fetching friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const getColor = (sesion: string | undefined) => {
    if (sesion === 'true') return "success";
    if (sesion === 'false') return "default";
  };

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] min-h-[100%] max-h-[100%] flex flex-col gap-6">
      <Card className="w-full">
        <CardBody className="flex flex-col w-full gap-6 px-6 py-5">
        {friends.slice(0, 8).map((friend, index) => (
            <div key={friend._id} className="flex justify-between w-full">
              <User name={<div className="flex items-center" style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                 <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{friend.fullname}</span>
                 {friend.verified && (
                   <RiVerifiedBadgeFill className="text-[#dd2525]" style={{ marginLeft: '5px', flexShrink: 0 }} />
                 )}
                 </div>} description={`@${friend.username}`} avatarProps={{ src: friend.image?.secure_url || 'https://via.placeholder.com/150', isBordered: true, color: getColor(friend.sesion), }} />
              <Badge color="danger" content={1} shape="circle" size="sm">
                <BellIcon size={25} />
              </Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </article>
  );
}

export default FriendsCard;