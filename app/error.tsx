"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";

function error() {
  return (
    <main className="h-screen flex items-center justify-center p-2">
      <div className="flex flex-col gap-5 dark:bg-zinc-900 py-4 px-8 rounded-lg">
        <img
          alt="not-found"
          className="w-full max-w-[350px]"
          src="https://res.cloudinary.com/dtbedhbr4/image/upload/v1720749704/cookie%20image%20page/ibnuznb4oivlqgsw9qhv.svg"
        />

        <Link className=" m-auto" href="/">
          <Button color="primary" variant="flat">
            Back to home
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default error;
