"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { userToken, User } from "@/types/Users"; // Importa los tipos

function STATS() {
  const [token, setToken] = useState("");
  const [users, setUsers] = useState<User[]>([]); // Define el tipo de estado
  const [selectedRoleIds, setSelectedRoleIds] = useState<{
    [key: string]: string;
  }>({});
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<userToken>(storedToken); // Usa el tipo definido

      setUsername(decodedToken.username);
      setImage(decodedToken.image?.secure_url || ""); // Accede a la propiedad secure_url del objeto image
      GetAllUsers(storedToken)
        .then((data) => {
          setUsers(data);
          const initialSelectedRoleIds: { [key: string]: string } = {};

          data.forEach((user: User) => {
            initialSelectedRoleIds[user._id] = user.role._id;
          });
          setSelectedRoleIds(initialSelectedRoleIds);
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Error logout in:", await response.text());
        throw new Error("logout failed");
      }
    } catch (error) {
      alert("Error al iniciar sesión. Intente nuevamente.");
    }
  };

  const GetAllUsers = async (token: string): Promise<User[]> => {
    try {
      const response = await fetch("http://localhost:3000/api/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data: User[] = await response.json();

        return data;
      } else {
        console.error("Error al obtener usuarios:", await response.text());
        throw new Error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new Error("Error al obtener usuarios");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center max-h-1/10 mb-5">
        <h1 className="text-lg uppercase">WELCOME: @{username}</h1>
        <div className="absolute top-0 right-0 m-2">
          <Dropdown>
            <DropdownTrigger>
              <Avatar className="object-cover" size="lg" src={image} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new" href="/admin">
                Users
              </DropdownItem>
              <DropdownItem key="copy" href="/admin/stats">
                Stats
              </DropdownItem>
              <DropdownItem key="edit" href="/admin/pubs">
                Post / Stories
              </DropdownItem>
              <DropdownItem key="delete" onClick={handleLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      STATS
    </main>
  );
}

export default STATS;
