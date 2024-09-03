"use client";
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Link from "next/link";

import { ThemeSwitch } from "../components/theme-switch";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-[#dd2525] dark:bg-black">
      <Image alt="Cookie Logo in Login Screen" className="p-1 bg-white rounded-full" height={250} src="/img/cookie_login.png" width={250} />
      <h1 className="text-6xl font-bold text-white ">COOKIE</h1>
      <p className="mb-5 text-xs text-white">ANOTHER SENSATION</p>
      <div className="">
        <Link href="auth/signin">
          <Button className="m-1 font-bold bg-white text-[#dd2525] dark:text-black dark:font-bold">
            Login
          </Button>
        </Link>
        <Link href="auth/signup">
          <Button className="m-1 font-bold bg-white text-[#dd2525] dark:text-black dark:font-bold">
            Register
          </Button>
        </Link>
        <div className="fixed bottom-0 right-0 m-2 flex items-center justify-center border bg-white rounded-md">
          <ThemeSwitch />
        </div>
      </div>
    </main>
  );
}
