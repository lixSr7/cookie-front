"use client";
import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  ScrollShadow,
  User,
} from "@nextui-org/react";

import { Image as ImageIcon } from "@geist-ui/icons";
import { UserWithPosts as typeUser, Post as typePost } from "@/types/Post";

import { getAllPosts } from "@/services/Posts";
import { useEffect, useState } from "react";

function PostsOfUser({ user }: { user: typeUser }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [posts, setPosts] = useState<typePost[]>([]);

  const fechData = () => {
    getAllPosts()
      .then((data: typePost[]) => {
        const fillteredPosts = data.filter((post) => post.user._id === user.id);
        setPosts(fillteredPosts);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  };

  useEffect(() => {
    fechData();
  }, [user]);

  return (
    <div>
      <Tooltip content="Posts">
        <Button isIconOnly color="default" onPress={onOpen}>
          <ImageIcon className="w-5 h-5 opacity-65" />
        </Button>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Posts of user {user.username}
              </ModalHeader>
              <ModalBody>
                <ScrollShadow
                  hideScrollBar
                  className="flex flex-col gap-4 h-[400px]"
                >
                  {posts &&
                    posts.map((post) => (
                      <CardPost post={post} key={post._id} />
                    ))}
                </ScrollShadow>
                {posts.length === 0 && <p>No posts</p>}
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

const CardPost = ({ post }: { post: typePost }) => {
  return (
    <Card className="w-full h-full  bg-zinc-800">
      <CardHeader>
        <User
          name={post.user.username}
          description={post.user.fullname}
          avatarProps={{
            src: post.user.image.secure_url,
          }}
        />
      </CardHeader>
      <div className=" flex flex-col gap-3 p-4 w-full">
        <span className="text-md">{post.content}</span>
        {post.image && (
          <Image
            src={post.image}
            alt="Post image"
            className="object-cover w-full"
          />
        )}
      </div>
      <CardFooter>
        <span className="text-xs">
          @Cookie & {new Date(post.createdAt).toDateString()}
        </span>
      </CardFooter>
    </Card>
  );
};

export default PostsOfUser;
