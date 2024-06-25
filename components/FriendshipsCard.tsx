'use client'
import { useEffect, useState } from "react";
import { User } from "@nextui-org/react";
import { Card, CardBody, Button } from "@nextui-org/react";

// Define la interfaz para el usuario
interface User {
  _id: string;
  fullname: string;
  username: string;
  image?: {
    secure_url: string;
  };
}

function FriendshipsCard() {
  const [token, setToken] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [followed, setFollowed] = useState<boolean[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    getAllUsers(storedToken);
  }, []);

  const getAllUsers = async (token: string | null) => {
    try {
      const response = await fetch('https://co-api-vjvb.onrender.com/api/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token || ''
        }
      });
      if (response.ok) {
        const users: User[] = await response.json();
        const randomUsers = getRandomUsers(users, 5);
        setUsers(randomUsers);
        setFollowed(randomUsers.map(() => false));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getRandomUsers = (users: User[], num: number): User[] => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  const handleFollowToggle = (index: number) => {
    setFollowed((prev) =>
      prev.map((isFollowed, i) => (i === index ? !isFollowed : isFollowed))
    );
  };

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] flex flex-col gap-4 ">
      {users.map((user, index) => (
        <Card key={user._id} className="w-full">
          <CardBody className="flex flex-col w-full gap-4 px-6 py-5">
            <div className="flex justify-between w-full">
              <User
                name={user.fullname}
                description={`@${user.username}`}
                avatarProps={{
                  src: user.image?.secure_url || 'https://via.placeholder.com/150',
                  isBordered: true,
                  color: "danger",
                }}
              />
              <Button
                color="danger"
                variant={followed[index] ? "shadow" : "ghost"}
                onClick={() => handleFollowToggle(index)}
              >
                {followed[index] ? "Following" : "Follow"}
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </article>
  );
}

export default FriendshipsCard;
