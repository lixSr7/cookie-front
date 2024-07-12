'use client';
import { User } from "@nextui-org/react";
import { Card, CardBody, Badge } from "@nextui-org/react";
import { Bell as BellIcon } from "@geist-ui/icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function FriendsCard() {
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [friends, setFriends] = useState<any[]>([]);
  const [friendsDetails, setFriendsDetails] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken: { id: string } = jwtDecode(storedToken);
        setUserId(decodedToken.id);
        console.log("Decoded Token ID:", decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId && token) {
      console.log("Fetching friends for user ID:", userId);
      getFriends(userId, token);
    }
  }, [userId, token]);

  const getFriends = async (userId: string, token: string) => {
    if (!userId || !token) {
      console.error("User ID or token is missing");
      return;
    }

    try {
      const url = `https://rest-api-cookie-u-c-p.onrender.com/api/users/friends/${userId}`;
      console.log("Fetching URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        console.log("Friends data (IDs):", data);
      } else {
        console.error("Error al obtener los amigos:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener los amigos:", error);
    }
  };

  useEffect(() => {
    if (friends.length > 0) {
      friends.forEach(friendId => {
        getUser(friendId);
      });
    }
  }, [friends]);

  const getUser = async (friendId: string) => {
    try {
      const url = `https://rest-api-cookie-u-c-p.onrender.com/api/users/${friendId}`;
      console.log("Fetching URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data);
        setFriendsDetails(prevDetails => [...prevDetails, data]);
      } else {
        console.error("Error al obtener el usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };


  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] max-h-[45%] min-h-[45%] flex flex-col gap-6">
      <Card className="w-full">
        <CardBody className="flex flex-col w-full gap-3 px-6 py-5">
          {friendsDetails.map((friend, index) => (
            <div key={index} className="flex justify-between w-full">
              <User name={friend.fullname} description={`@${friend.username}`} avatarProps={{ src: friend.image?.secure_url || 'https://via.placeholder.com/150', isBordered: true, color: "danger" }} />
              <Badge color="danger" content={10} shape="circle" size="sm">
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
