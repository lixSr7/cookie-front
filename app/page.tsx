"use client";
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-[#dd2525]">
      <Image
        width={250}
        height={250}
        className="p-1 bg-white rounded-full"
        alt="NextUI hero Image"
        src="/img/cookie_login.png"
      />
      <h1 className="text-6xl font-bold text-white ">COOKIE</h1>
      <p className="mb-5 text-xs text-white">ANOTHER SENSATION</p>
      <div className="">
        <Link href="auth/signin">
          <Button className="m-1 font-bold bg-white text-[#dd2525]">
            signin
          </Button>
        </Link>
        <Link href="auth/signup">
          <Button className="m-1 font-bold bg-white text-[#dd2525]">
            singup
          </Button>
        </Link>
      </div>
    </main>
  );
}
