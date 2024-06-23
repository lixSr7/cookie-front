import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Input, Spinner } from "@nextui-org/react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  role: { _id: string; name: string };
}

interface SearchUsersProps {
  onUserSelect: (user: User) => void;
  selectedUsers: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchUsers: React.FC<SearchUsersProps> = ({ onUserSelect, selectedUsers, searchTerm, setSearchTerm }) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleSearch = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "https://rest-api-cookie-u-c-p.onrender.com/api/users/search",
          { term: searchTerm },
          {
            headers: { "x-access-token": token },
          }
        );

        const filteredResults = response.data.filter((user: User) => user.role && user.role.name === "user");

        setResults(filteredResults);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleUserSelect = (user: User) => {
    onUserSelect(user);
  };

  return (
    <div className="p-4">
      <Input
        radius="lg"
        placeholder="Type to search..."
        labelPlacement="outside"
        startContent={<CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="mt-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner label="Loading..." color="danger" />
          </div>
        ) : (
          results.map((user) => (
            <li
              key={user._id}
              className={`p-2 cursor-pointer ${selectedUsers.some(selectedUser => selectedUser._id === user._id) ? "bg-gray-200 dark:bg-zinc-700" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              {user.username}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchUsers;