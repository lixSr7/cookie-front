"use client";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Input, Button, Image, useDisclosure } from "@nextui-org/react";
import {
  Eye as EyeFilledIcon,
  EyeOff as EyeSlashFilledIcon,
} from "@geist-ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import RECOVER from "../recover/recover";
import "react-toastify/dist/ReactToastify.css";

interface IUser {
  role: string;
}

export default function SIGNIN() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername) {
      toast.error("Email or username is required.");

      return;
    }
    if (!password) {
      toast.error("Password is required.");

      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrUsername,
            password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        const decodedToken: IUser = jwtDecode(data.token);
        const userRole = decodedToken.role;

        localStorage.setItem("token", data.token);
        if (userRole === "user") {
          router.push("/posts");
        } else if (userRole === "admin") {
          router.push("/admin");
        } else if (userRole === "moderator") {
          router.push("/moder");
        }
      } else {
        handleErrors(response.status, data.message);
      }
    } catch (error) {
      toast.error("Error logging in. Please try again.");
    }
  };

  const handleErrors = (status: number, message: string) => {
    switch (status) {
      case 400:
        toast.error(message || "Invalid request. Please check your input.");
        break;
      case 401:
        toast.error(message || "Incorrect password.");
        break;
      case 403:
        toast.error(
          message || "User is inactive. Please contact the administrator.",
        );
        break;
      case 404:
        toast.error(message || "Email or username not found.");
        break;
      default:
        toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col items-center justify-between w-1/2 text-black bg-white">
        <div className="flex flex-col items-center justify-center h-1/4 max-h-1/4 min-h-1/4">
          <h1 className="text-5xl font-bold text-[#dd2525]">WELCOME</h1>
          <hr className="w-1/2" />
          <p className="text-xs text-gray-400">
            Sign in to access all features
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mb-4 h-1/2 max-h-1/2 min-h-1/2">
          <Input
            required
            isDisabled={isSending}
            label="Email or username"
            type="text"
            value={emailOrUsername}
            variant="bordered"
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <Input
            required
            className="max-w-xs text-black"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="stroke-2 stroke-gray-500" />
                ) : (
                  <EyeFilledIcon className="stroke-2 stroke-gray-500" />
                )}
              </button>
            }
            isDisabled={isSending}
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={password}
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-1/2 font-bold text-white bg-[#dd2525]"
            isLoading={isSending}
            onClick={handleLogin}
          >
            Login
          </Button>
          <div className="flex flex-col items-center justify-center gap-0 m-0">
            <p className="text-xs text-black">
              Don&apos;t have an account?
              <Link className="font-bold text-[#dd2525]" href="/auth/signup">
                Register Now
              </Link>
            </p>
            <p className="text-xs text-black">
              Forgot your password?
              <button className="font-bold text-[#dd2525]" onClick={onOpen}>
                Recover
              </button>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-3 h-1/4 max-h-1/4 min-h-1/4">
          <hr className="w-1/5" />
          <p className="text-xs text-gray-400">
            Privacy and security policies - All rights reserved ©
          </p>
        </div>
        <Link
          className="fixed top-0 left-0 flex items-center justify-center w-full h-full m-4 rounded-full cursor-pointer hover:bg-zinc-100 max-w-6 max-h-6"
          href="/"
        >
          <div>
            <svg
              className="w-8 h-8 p-2 font-bold text-[#dd2525]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 text-white bg-[#dd2525]">
        <Image
          alt="Cookie Logo in Login Screen"
          className="p-1 bg-white rounded-full"
          height={250}
          src="/img/cookie_login.png"
          width={250}
        />
        <p className="font-bold">COOKIE, The new social network for people</p>
        <p className="font-bold">with visual disabilities.</p>
      </div>
      <RECOVER isOpen={isOpen} onOpenChange={onOpenChange} />
      <ToastContainer limit={5} />
    </div>
  );
}
