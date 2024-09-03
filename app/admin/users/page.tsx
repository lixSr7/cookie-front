'use client';
import { capitalize } from "@/utils/Capitalize";
import { Input, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Chip, Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, SortDescriptor, Selection, useDisclosure, ModalHeader, Modal, ModalBody, ModalContent, Image, ButtonGroup, Switch, Badge } from "@nextui-org/react";
import { Search as SearchIcon, ChevronDown as ChevronDownIcon, Plus as PlusIcon, MoreVertical as VerticalDotsIcon } from "@geist-ui/icons";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { columns } from "../posts/data";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import socket from "@/app/config/socketConfig";

const statusColorMap: Record<'active' | 'inactive', "success" | "danger"> = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["picture", "fullname", "username", "email", "role", "status", "actions"];

interface User {
  fullname: string;
  username: string;
  email: string;
  role: { name: string };
  status: 'active' | 'inactive';
  [key: string]: any;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "fullname",
    direction: "ascending",
  });
  const { isOpen: isViewUsersOpen, onOpen: onViewUsersOpen, onOpenChange: onViewUsersOpenChange } = useDisclosure();
  const { isOpen: isEditUserOpen, onOpen: onEditUserOpen, onOpenChange: onEditUserOpenChange } = useDisclosure();

  const [page, setPage] = useState(1);

  useEffect(() => {
    socket.connect();

    socket.on("userUpdate", async () => {
      await fetchUsers();
    });

    return () => {
      socket.off("userUpdate");
    };
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns.size === columns.length) return columns;

    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (filterValue) {
      const lowercasedFilterValue = filterValue.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        Object.values(user).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(lowercasedFilterValue)
        )
      );
    }

    if (roleFilter !== "all") {
      filteredUsers = filteredUsers.filter(user =>
        user.role.name.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter(user =>
        user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter, roleFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof User];
      const second = b[sortDescriptor.column as keyof User];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user: User, columnKey: keyof User) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "picture":
        return (
          <Badge color={user.sesion === "false" ? "success" : "danger"} size="lg" variant="shadow" content=''>
            <User avatarProps={{ radius: "lg", src: user.image?.secure_url }} name={cellValue} />
          </Badge>
        );
      case "fullname":
        return (
          <div className="flex items-center justify-start gap-4">
            <div className="flex flex-col">
              <strong className="text-base m-0 flex justify-center items-center">
                {(() => {
                  const words = user.fullname.split(" ");
                  if (words.length === 4) {
                    return `${words[0]} ${words[2]}`;
                  } else if (words.length === 3) {
                    return `${words[0]} ${words[1]}`;
                  } else {
                    return user.fullname;
                  }
                })()}
                <span className="ml-2">
                  {user?.verified === 'true' && (
                    <RiVerifiedBadgeFill className="text-2xl text-[#dd2525]" />
                  )}
                </span>
              </strong>
            </div>
          </div>
        );
      case "username":
        return (
          <div className="flex items-center justify-start gap-4">
            <div className="flex flex-col">
              <strong className="text-base m-0 flex justify-center items-center">
                @{user?.username}
              </strong>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="flex items-center justify-start gap-4">
            <div className="flex flex-col">
              <strong className="text-base m-0 flex justify-center items-center">
                {user?.email}
              </strong>
            </div>
          </div>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.role.name}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status as keyof typeof statusColorMap]} size="sm" variant="flat" >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex justify-start items-center gap-2">
            <Button color="success" size="sm" variant="flat" onClick={() => handleViewUser(user)} endContent={<FaEye />} />
            <Button color="danger" size="sm" variant="flat" onClick={() => handleEditUser(user)} endContent={<MdEdit />} />
            <Switch isSelected={user.status === 'active'} onChange={(e) => handleChangeStatus(user._id, e.target.checked ? 'active' : 'inactive')} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input isClearable className="w-full sm:max-w-[44%]" placeholder="Search by name..." startContent={<SearchIcon />} value={filterValue} onClear={() => onClear()} onValueChange={onSearchChange} />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Filter by Role" closeOnSelect={true} selectedKeys={new Set([roleFilter])} selectionMode="single" onSelectionChange={(keys) => setRoleFilter(Array.from(keys).join(""))} >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="user">User</DropdownItem>
                <DropdownItem key="moderator">Moderator</DropdownItem>
                <DropdownItem key="admin">Admin</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Filter by Status" closeOnSelect={true} selectedKeys={new Set([statusFilter])} selectionMode="single" onSelectionChange={(keys) => setStatusFilter(Array.from(keys).join(""))} >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="active">Active</DropdownItem>
                <DropdownItem key="inactive">Inactive</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect={false} selectedKeys={visibleColumns} selectionMode="multiple" onSelectionChange={setVisibleColumns} >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange} >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");

    if (!token) return;

    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://rest-api-cookie-u-c.onrender.com/api/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Data is not an array:', data);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onViewUsersOpen();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onEditUserOpen();
  };

  const changeRole = async (role: string) => {
    try {
      const response = await fetch(`https://rest-api-cookie-u-c.onrender.com/api/users/role/${selectedUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          role,
        }),
      });

      if (response.ok) {
        onEditUserOpenChange();
      } else {
        console.error("Error changing role:", await response.text());
        throw new Error("Error changing role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      throw new Error("Error changing role");
    }
  };

  const handleChangeStatus = async (userId: string, status: string) => {
    changeStatus(userId, status);
  }

  const changeStatus = async (userId: string, status: string) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`https://rest-api-cookie-u-c.onrender.com/api/users/status/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": storedToken,
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      if (response.ok) {
      } else {
        console.error("Error changing status:", await response.text());
        throw new Error("Error changing status");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      throw new Error("Error changing status");
    }
  };

  const handleVerifyUser = async (userId: string, verified: string) => {
    verifyUser(userId, verified);
  }

  const verifyUser = async (userId: string, verified: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`https://rest-api-cookie-u-c.onrender.com/api/users/verified/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          verified: verified,
        }),
      });

      if (response.ok) {
        onEditUserOpenChange();
      } else {
        console.error("Error verifying user:", await response.text());
        throw new Error("Error verifying user");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      throw new Error("Error verifying user");
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <Table aria-label="Example table with dynamic content & infinity pagination" isHeaderSticky bottomContent={bottomContent} bottomContentPlacement="outside" classNames={{ wrapper: "max-h-content", }} selectedKeys={selectedKeys} selectionMode="single" sortDescriptor={sortDescriptor} topContent={topContent} topContentPlacement="outside" onSelectionChange={setSelectedKeys} onSortChange={setSortDescriptor} >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isViewUsersOpen} onOpenChange={onViewUsersOpenChange} backdrop="blur" size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 justify-center items-center">
            {selectedUser?.fullname} User View
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full h-full flex flex-col items-center justify-center">
              {selectedUser && (
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <Image alt="User Image" className="object-cover w-40 h-40" src={selectedUser.image?.secure_url || "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"} />
                  <div className="w-full flex items-center justify-center gap-2">
                    <p className="text-2xl font-bold">{selectedUser.fullname}</p>
                    <span>{selectedUser.verified === 'true' && (<RiVerifiedBadgeFill className="text-2xl text-[#dd2525]" />)}</span>
                  </div>
                  <p className="text-xs text-gray-300">@{selectedUser.username}</p>
                  <ButtonGroup className="m-4">
                    <Button color="default">Following: {selectedUser.following.length}</Button>
                    <Button color="default">Followers: {selectedUser.followers.length}</Button>
                    <Button color="default">Friends: {selectedUser.friends.length}</Button>
                  </ButtonGroup>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditUserOpen} onOpenChange={onEditUserOpenChange} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col justify-center gap-1">
            Edit User
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full h-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 flex justify-center items-center gap-4 p-2 ">
                <label htmlFor="">Change Role: </label>
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="w-full min-h-full text-left">
                      {selectedUser?.role?.name || 'Select Role'}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="admin" onClick={() => changeRole('admin')}>
                      Admin
                    </DropdownItem>
                    <DropdownItem key="user" onClick={() => changeRole('user')}>
                      User
                    </DropdownItem>
                    <DropdownItem key="moderator" onClick={() => changeRole('moderator')}>
                      Moderator
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="col-span-1 flex justify-center items-center gap-4 p-2 ">
                <label htmlFor="">Change Verified status: </label>
                <Switch isSelected={selectedUser?.verified === 'true'} onChange={(e) => handleVerifyUser(selectedUser?._id, e.target.checked ? 'true' : 'false')} />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div >
  );
}