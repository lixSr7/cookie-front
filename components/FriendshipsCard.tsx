"use client";
import {
  User as NextUser,
  Spinner,
  Card,
  CardBody,
  Button,
  Skeleton,
} from "@nextui-org/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

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
  const [token, setToken] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [followed, setFollowed] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [following, setFollowing] = useState<User[]>([]);
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
      const fetchData = async () => {
        setLoading(true);
        try {
          const followingData = await getFollowing(userId, token);

          setFollowing(followingData);

          const allUsers = await getAllUsers(token);

          if (allUsers) {
            const followedStatus = allUsers.map((user) =>
              followingData.some(
                (followedUser) => followedUser._id === user._id
              )
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
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/users/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

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
  };

  const getRandomUsers = (users: User[], num: number): User[] => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
  };

  const handleFollowToggle = async (index: number) => {
    const userIdToToggle = users[index]._id;
    const followStatus = !followed[index];
    const endpoint = followStatus
      ? `https://rest-api-cookie-u-c.onrender.com/api/users/follow/${userIdToToggle}`
      : `https://rest-api-cookie-u-c.onrender.com/api/users/unfollow/${userIdToToggle}`;
    const method = "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
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

  const userSkeleton = () => (
    <div className="max-w-full w-full flex items-center gap-4 my-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
    </div>
  );

  const skeleton = () => (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-2 px-6">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full"
            >
              {userSkeleton()}
            </div>
          ))}
      </CardBody>
    </Card>
  );

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] min-h-[55%] max-h-[55%] flex flex-col gap-4 ">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-full gap-3">
          {skeleton()}
        </div>
      ) : (
        users.map((user, index) => (
          <Card key={user._id} className="w-full">
            <CardBody className="flex flex-col w-full gap-4 px-6 py-3">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <NextUser
                    avatarProps={{
                      src:
                        user.image?.secure_url ||
                        "https://via.placeholder.com/150",
                      size: "lg",
                    }}
                    description={`@${user.username}`}
                    name={
                      <div
                        className="flex items-center"
                        style={{
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {" "}
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {" "}
                          {user.fullname}{" "}
                        </span>{" "}
                        {user.verified && (
                          <RiVerifiedBadgeFill
                            className="text-[#dd2525]"
                            style={{ marginLeft: "5px", flexShrink: 0 }}
                          />
                        )}{" "}
                      </div>
                    }
                  />
                </div>
                <Button
                  className={`${
                    followed[index]
                      ? "bg-[#dd2525] text-white shadow"
                      : "bg-transparent border border-[#dd2525] text-[#dd2525]"
                  }`}
                  variant={followed[index] ? "shadow" : "ghost"}
                  onClick={() => handleFollowToggle(index)}
                >
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
