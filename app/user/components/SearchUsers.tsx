import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Input, Spinner, Avatar, Pagination } from "@nextui-org/react";
import axios from "axios";
import { GrCheckboxSelected } from "react-icons/gr";

interface User {
  _id: string;
  username: string;
  role: { _id: string; name: string };
  image: {
    secure_url?: string;
  };
}

interface SearchUsersProps {
  onUserSelect: (user: User) => void;
  selectedUsers: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchUsers: React.FC<SearchUsersProps> = ({
  onUserSelect,
  selectedUsers,
  searchTerm,
  setSearchTerm,
}) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const resultsPerPage = 5;

  useEffect(() => {
    const handleSearch = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "https://rest-api-cookie-u-c.onrender.com/api/users/search",
          { term: searchTerm },
          {
            headers: { "x-access-token": token },
          }
        );

        const filteredResults = response.data.filter(
          (user: User) => user.role && user.role.name === "user"
        );

        setResults(filteredResults);
      } catch (error) {
        // console.error removed to avoid production warnings
        // Use a logging service or other debugging approach as needed
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const paginatedResults = results.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div className="p-4 max-h-">
      <Input
        labelPlacement="outside"
        placeholder="Type to search..."
        radius="lg"
        startContent={
          <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="mt-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner color="danger" label="Loading..." />
          </div>
        ) : (
          paginatedResults.map((user) => (
            <button
              key={user._id}
              className={`flex items-center p-2 transition-colors duration-200 rounded-lg w-full max-w-[8em]${
                selectedUsers.some(
                  (selectedUser) => selectedUser._id === user._id
                )
                  ? "bg-gray-200 dark:bg-zinc-700"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-600"
              }`}
              tabIndex={0}
              onClick={() => handleUserSelect(user)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUserSelect(user);
              }}
            >
              <Avatar className="mr-3" size="sm" src={user.image?.secure_url}>
                {user.username.charAt(0)}
              </Avatar>
              <div className="flex-1 justify-between">{user.username}</div>
              {selectedUsers.some(
                (selectedUser) => selectedUser._id === user._id
              ) && <GrCheckboxSelected color="danger" />}
            </button>
          ))
        )}
      </ul>
      {results.length > resultsPerPage && (
        <div className="flex justify-center mt-4">
          <Pagination
            color="danger"
            initialPage={1}
            total={Math.ceil(results.length / resultsPerPage)}
            variant="bordered"
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
