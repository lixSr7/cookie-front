'use client'
import { useEffect, useState } from "react";
import { User as NextUser, Spinner } from "@nextui-org/react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import { RiVerifiedBadgeFill } from "react-icons/ri";

interface User {
  _id: string;
  fullname: string;
  username: string;
  image?: {
    secure_url: string;
  };
  verified?: boolean; 
}

function FriendshipsCard() {
  const [token, setToken] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [followed, setFollowed] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      const fetchData = async () => {
        setLoading(true);
        try {
          const followingData = await getFollowing(userId, token);
          setFollowing(followingData);

          const allUsers = await getAllUsers(token);
          if (allUsers) {
            const followedStatus = allUsers.map(user =>
              followingData.some(followedUser => followedUser._id === user._id)
            );
            setUsers(allUsers);
            setFollowed(followedStatus);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userId, token]);

  const getAllUsers = async (token: string): Promise<User[] | null> => {
    try {
      const response = await fetch('https://cookie-rest-api-8fnl.onrender.com/api/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      if (response.ok) {
        const users: User[] = await response.json();
        const randomUsers = getRandomUsers(users, 3);
        return randomUsers;
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      return null;
    }
  }

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
        const data: User[] = await response.json();
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

  const getRandomUsers = (users: User[], num: number): User[] => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  const handleFollowToggle = async (index: number) => {
    const userIdToToggle = users[index]._id;
    const followStatus = !followed[index];
    const endpoint = followStatus
      ? `https://cookie-rest-api-8fnl.onrender.com/api/users/follow/${userIdToToggle}`
      : `https://cookie-rest-api-8fnl.onrender.com/api/users/unfollow/${userIdToToggle}`;
    const method = 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowed((prev) =>
          prev.map((isFollowed, i) => (i === index ? followStatus : isFollowed))
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] min-h-[55%] max-h-[55%] flex flex-col gap-4 ">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Spinner size="lg" color="danger" />
        </div>
      ) : (
        users.map((user, index) => (
          <Card key={user._id} className="w-full">
            <CardBody className="flex flex-col w-full gap-4 px-6 py-5">
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <NextUser name={ 
                      <div className="flex items-center" style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.fullname}
                        </span>
                        {user.verified && (
                          <RiVerifiedBadgeFill className="text-[#dd2525]" style={{ marginLeft: '5px', flexShrink: 0 }} />
                        )}
                      </div>
                    }
                    description={`@${user.username}`}
                    avatarProps={{ src: user.image?.secure_url || 'https://via.placeholder.com/150', isBordered: true, color: 'danger' }}
                  />
                </div>
                <Button color="danger" variant={followed[index] ? "shadow" : "ghost"} onClick={() => handleFollowToggle(index)} >
                  {followed[index] ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </article>
  );
}

export default FriendshipsCard;