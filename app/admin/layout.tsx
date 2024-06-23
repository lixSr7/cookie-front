import type { Metadata } from "next";
import { ReactNode } from "react";
// import Sidbar from "./components/Sidbar";
import Sidebar from "./components/sib-bar";

export const metadata: Metadata = {
  title: "Cookie Dashboard",
  description: "Cookie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-screen ">
      <Sidebar/>
      {/* <Sidbar /> */}
      <div className="w-full h-full px-4 py-8">{children}</div>
    </div>
  );
}
