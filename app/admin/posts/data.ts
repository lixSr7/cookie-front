const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "USERNAME", uid: "username", sortable: true },
  { name: "FULLNAME", uid: "fullname" },
  { name: "EMAIL", uid: "email", sortable: true }, 
  { name: "ROLE", uid: "role", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];


const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
];


export { columns, statusOptions };
