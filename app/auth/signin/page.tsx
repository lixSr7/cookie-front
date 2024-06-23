'use client'
import React, { useState } from 'react';
import { Input } from "@nextui-org/react";
import { Eye as EyeFilledIcon, EyeOff as EyeSlashFilledIcon } from '@geist-ui/icons';
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import RECOVER from "../recover/page";
import { useDisclosure } from '@nextui-org/react';

interface IUser {
    role: string;
}

export default function SIGNIN() {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);

    const handleLogin = async () => {
        setIsSending(true);
        try {
            const response = await fetch('https://co-api-vjvb.onrender.com/api/auth/signin?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailOrUsername,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const decodedToken: IUser = jwtDecode(data.token);
                const userRole = decodedToken.role;
                localStorage.setItem('token', data.token);
                if (userRole === 'user') {
                    router.push('/posts');
                } else if (userRole === 'admin') {
                    router.push('/admin');
                } else if (userRole === 'moderator') {
                    router.push('/moder');
                }
            } else {
                console.error("Error logging in:", await response.text());
                throw new Error("Login failed");
            }
        } catch (error) {
            console.log("Login error:", error);
            alert("Error al iniciar sesión. Intente nuevamente.");
            setIsSending(false);
        }
    };


    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col items-center justify-between w-1/2 text-black bg-white">
                <div className="flex flex-col items-center justify-center h-1/4 max-h-1/4 min-h-1/4 ">
                    <h1 className="text-5xl font-bold text-danger-500 ">
                        WELCOME
                    </h1>
                    <hr className="w-1/2" />
                    <p className="text-xs text-gray-400">Sign in to access all features</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 mb-4 h-1/2 max-h-1/2 min-h-1/2">
                    <Input required isDisabled={isSending} type="text" variant="bordered" label="Email or username" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
                    <Input required isDisabled={isSending} label="Password" variant="bordered" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="stroke-2 stroke-gray-500" />
                            ) : (
                                <EyeFilledIcon className="stroke-2 stroke-gray-500" />
                            )}
                        </button>
                    } type={isVisible ? "text" : "password"} className="max-w-xs text-black"
                    />
                    <Button className="w-1/2 font-bold text-white bg-danger-500" onClick={handleLogin} isLoading={isSending}>
                        Login
                    </Button>
                    <div className="flex flex-col items-center justify-center gap-0 m-0">
                        <p className="text-xs text-black">Dont have an account?   <a href="/auth/signup" className="font-bold text-danger-500"> Register Now</a></p>
                        <p className="text-xs text-black">Forgot your password? <a href="#" onClick={onOpen} className="font-bold text-danger-500"> Recover</a></p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center mb-3 h-1/4 max-h-1/4 min-h-1/4">
                    <hr className="w-1/5" />
                    <p className="text-xs text-gray-400">politics of privacy and security -  All rights reserved ©</p>
                </div>
                <Link className="fixed top-0 left-0 flex items-center justify-center w-full h-full m-4 rounded-full cursor-pointer hover:bg-zinc-100 max-w-6 max-h-6" href="/">
                    <div >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 p-2 font-bold text-danger-500">
                            <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 text-white bg-danger-500">
                <Image
                    width={250}
                    height={250}
                    className="p-1 bg-white rounded-full"
                    alt="NextUI hero Image"
                    src="/img/cookie_login.png"
                />
                <p className="font-bold">
                    COOKIE, The new social network for people
                </p>
                <p className="font-bold">
                    with visual disabilities.
                </p>
            </div>
            <RECOVER isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
    );
}
