// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./AdminDropdown.css";

// const AdminDropdown = ({ role }) => {
//   const navigate = useNavigate();

//   const handleNavigate = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="admin-dropdown">
//       <button className="dropdown-toggle">Admin</button>
//       <div className="dropdown-menu">
//         {role === "superadmin" && (
//           <>
//             <button onClick={() => handleNavigate("/admin/show-all")}>
//               Show All Admins
//             </button>
//             <button onClick={() => handleNavigate("/admin/add")}>
//               Add Admin
//             </button>
//             <button onClick={() => handleNavigate("/admin/edit-delete")}>
//               Edit/Delete Admin
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDropdown;
