'use client'
import { useState } from "react";
import { User } from "@nextui-org/react";
import { Card, CardBody, Button } from "@nextui-org/react";

function FriendshipsCard() {
  const users = [
    {
      name: "Bizzarrap",
      nickName: "Luis Whiston L",
      image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
      name: "Shakira",
      nickName: "Shaki",
      image: "https://i.pravatar.cc/150?u=a04258114e29026302e",
    },
    {
      name: "Bad Bunny",
      nickName: "Benito",
      image: "https://i.pravatar.cc/150?u=a04258114e29026302f",
    },
    {
      name: "Rosalía",
      nickName: "Rosalia_VT",
      image: "https://i.pravatar.cc/150?u=a04258114e29026303a",
    },
    {
      name: "J Balvin",
      nickName: "Jose",
      image: "https://i.pravatar.cc/150?u=a04258114e29026303b",
    },
  ];

  const [followed, setFollowed] = useState(users.map(() => false));

  const handleFollowToggle = (index: number) => {
    setFollowed((prev) =>
      prev.map((isFollowed, i) => (i === index ? !isFollowed : isFollowed))
    );
  };

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] flex flex-col gap-4 ">
      {users.map((user, index) => (
        <Card key={index} className="w-full">
          <CardBody className="flex flex-col w-full gap-4 px-6 py-5">
            <div className="flex justify-between w-full">
              <User
                name={user.name}
                description={`@${user.nickName}`}
                avatarProps={{
                  src: user.image,
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
