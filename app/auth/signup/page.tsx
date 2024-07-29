"use client"
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../utils/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../utils/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SIGNUP() {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);

    const handleRegister = async () => {
        if (!username) {
            toast.error("Username is required.");
            return;
        }
        if (username.length < 8 || username.length > 20) {
            toast.error("Username must be between 8 and 20 characters long.");
            return;
        }
        if (!email) {
            toast.error("Email is required.");
            return;
        }
        if (!email.includes("@")) {
            toast.error("Email must include '@'.");
            return;
        }
        if (!password) {
            toast.error("Password is required.");
            return;
        }
        if (!confirmPassword) {
            toast.error("Confirm password is required.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 8 || password.length > 20) {
            toast.error("Password must be between 8 and 20 characters long.");
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch('https://cookie-rest-api-8fnl.onrender.com/api/auth/signup?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            });

            if (response.ok) {
                toast.success('Registro exitoso');

                setTimeout(() => {
                    router.push('/auth/signin');
                }, 1500);
            } else {
                // console.log('error bro')
            }

        } catch (error) {
            // console.log(error)
            setIsSending(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col items-center justify-center w-1/2 text-white bg-[#dd2525]">
                <Image
                    width={250}
                    height={250}
                    className="p-1 bg-white rounded-full"
                    alt="NextUI hero Image"
                    src="/img/cookie_register.png"
                />
                <p className="font-bold">
                    COOKIE, The new social network for people
                </p>
                <p className="font-bold">
                    with visual disabilities.
                </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 text-black bg-white">
                <div className="flex flex-col items-center justify-center m-6 h-1/4 max-h-1/4 min-h-1/4">
                    <h1 className="text-5xl font-bold text-[#dd2525] ">
                        WELCOME
                    </h1>
                    <hr className="w-1/2" />
                    <p className="text-xs text-gray-400">Sign up to access all features</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 mb-4 h-2/3 max-h-2/3 min-h-2/3">
                    <Input required isDisabled={isSending} type="text" variant="bordered" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input required isDisabled={isSending} type="text" variant="bordered" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input required isDisabled={isSending} label="Password" variant="bordered" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl pointer-events-none text-default-400" />
                            ) : (
                                <EyeFilledIcon className="text-2xl pointer-events-none text-default-400" />
                            )}
                        </button>
                    }
                        type={isVisible ? "text" : "password"}
                        className="text-black"
                    />
                    <Input required isDisabled={isSending} label="Confirm Password" variant="bordered" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl pointer-events-none text-default-400" />
                            ) : (
                                <EyeFilledIcon className="text-2xl pointer-events-none text-default-400" />
                            )}
                        </button>
                    }
                        type={isVisible ? "text" : "password"}
                        className="text-black"
                    />
                    <Button className="w-1/2 font-bold text-white bg-[#dd2525]" onClick={handleRegister} isLoading={isSending}>
                        Register
                    </Button>
                    <div className="flex flex-col items-center justify-center gap-0 m-0">
                        <p className="text-xs text-black">already have an account? <a href="/auth/signin" className="font-bold text-[#dd2525]"> Login Now</a></p>
                    </div>
                    <Link className="fixed top-0 flex items-center justify-center w-full h-full m-4 rounded-full cursor-pointer hover:bg-zinc-100 max-w-6 max-h-6 left-1/2" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 p-2 font-bold text-[#dd2525]">
                            <path strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center mb-3 h-1/4 max-h-1/4 min-h-1/4">
                    <hr className="w-1/5" />
                    <p className="text-xs text-gray-400">politics of privacy and security -  All rights reserved ©</p>
                </div>
            </div>
            <ToastContainer limit={5} />
        </div>

    );
}