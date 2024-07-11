"use client"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Card, CardBody, Image, Avatar } from "@nextui-org/react";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

function STATS() {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState({});
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    // console.log("Stored token:", storedToken);
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setUsername(decodedToken.username);
      setImage(decodedToken.image.secure_url);
      GetAllUsers(storedToken)
        .then(data => {
          setUsers(data);
          const initialSelectedRoleIds = {};
          data.forEach(user => {
            initialSelectedRoleIds[user._id] = user.role._id;
          });
          setSelectedRoleIds(initialSelectedRoleIds);
        })
        .catch(error => {
          console.error("Error al obtener usuarios:", error);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error("Error logout in:", await response.text());
        throw new Error("logout failed");
      }
    } catch (error) {
      // console.log("Login error:", error);
      alert("Error al iniciar sesión. Intente nuevamente.");
    }
  };

  const GetAllUsers = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error al obtener usuarios:", await response.text());
        throw new Error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new Error("Error al obtener usuarios");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center max-h-1/10 mb-5">
        <h1 className="text-lg uppercase">WELCOME: @{username}</h1>
        <div className="absolute top-0 right-0 m-2">
          <Dropdown>
            <DropdownTrigger>
              <Avatar src={image} size="lg" className="object-cover"></Avatar>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new" href="/admin">Users</DropdownItem>
              <DropdownItem key="copy" href="/admin/stats">Stas</DropdownItem>
              <DropdownItem key="edit" href="/admin/pubs">Post / Stories</DropdownItem>
              <DropdownItem key="delete" onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
        STATS
      </main>
  );
}

export default STATS
