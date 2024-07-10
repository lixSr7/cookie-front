'use client'; 
import { User } from "@nextui-org/react";
import { Card, CardBody, Badge } from "@nextui-org/react";
import { Bell as BellIcon } from "@geist-ui/icons";

function FriendsCard() {
  const users = [
    {
      name: "John Doe",
      nickName: "john_doe123",
      image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
      name: "Jane Smith",
      nickName: "jane_smith456",
      image: "https://i.pravatar.cc/150?u=a04258114e29026303d",
    },
    {
      name: "Mike Johnson",
      nickName: "mike_johnson789",
      image: "https://i.pravatar.cc/150?u=a04258114e29026304d",
    },
    {
      name: "Emily Brown",
      nickName: "emily_brown012",
      image: "https://i.pravatar.cc/150?u=a04258114e29026305d",
    },
    // {
    //   name: "Chris Wilson",
    //   nickName: "chris_wilson345",
    //   image: "https://i.pravatar.cc/150?u=a04258114e29026306d",
    // },
  ];

  return (
    <article className="w-full max-w-[22em] min-[1920px]:max-w-[25em] max-h-[45%] min-h-[45%] flex flex-col gap-6">
      <Card className="w-full">
        <CardBody className="flex flex-col w-full gap-3 px-6 py-5">
          {users.map((user, index) => (
            <div key={index} className="flex justify-between w-full">
              <User
                name={user.name}
                description={`@${user.nickName}`}
                avatarProps={{
                  src: user.image,
                  isBordered: true,
                  color: "danger",
                }}
              />
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
