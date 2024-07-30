"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";

const Counter: React.FC = () => {
  const [userCounter, setUserCounter] = useState<number>(0);
  const [postCounter, setPostCounter] = useState<number>(0);
  const [chatCounter, setChatCounter] = useState<number>(0);
  const totalUsers = 20; // Adjust this total so that the user counter reaches 60%
  const totalPosts = 65; // Adjust this total so that the post counter reaches 70%
  const totalChats = 99; // Adjust this total so that the chat counter reaches 99%

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCounter((previousCounter) =>
        incrementCounter(previousCounter, totalUsers)
      );
      setPostCounter((previousCounter) =>
        incrementCounter(previousCounter, totalPosts)
      );
      setChatCounter((previousCounter) =>
        incrementCounter(previousCounter, totalChats)
      );
    }, 20); // We adjust the interval so that the counter reaches the total in 2 seconds

    return () => clearInterval(interval);
  }, []);

  const incrementCounter = (previousCounter: number, total: number): number => {
    if (previousCounter < total) {
      const increment = Math.max(
        Math.floor(((total - previousCounter) / 50) * 4),
        1
      ); // We adjust the increment to be faster
      return previousCounter + increment;
    } else {
      return previousCounter;
    }
  };

  return (
    <div className=" flex justify-between items-center w-full h-full">
      {["Users", "Posts", "Chats"].map((label, index) => {
        const counter = [userCounter, postCounter, chatCounter][index];
        const total = [totalUsers, totalPosts, totalChats][index];

        let percentage = 0;
        if (label === "Users") {
          percentage = 20;
        }
        if (label === "Posts") {
          percentage = 99;
        }
        if (label === "Chats") {
          percentage = 69;
        }

        return (
          <Card
            key={label}
            className="w-[200px] h-full max-h-[220px] border-none bg-gradient-to-br from-green-500 to-blue-500"
          >
            <CardBody className="justify-center items-center pb-0">
              <CircularProgress
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: "stroke-white",
                  track: "stroke-white/10",
                  value: "text-3xl font-semibold text-white",
                }}
                value={percentage}
                strokeWidth={4}
                showValueLabel={true}
              />
            </CardBody>
            <CardFooter className="justify-center items-center pt-0">
              <Chip
                classNames={{
                  base: "border-1 border-white/30",
                  content: "text-white/90 text-small font-semibold",
                }}
                variant="bordered"
              >
                {counter} {label.toLowerCase()}
              </Chip>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default Counter;
