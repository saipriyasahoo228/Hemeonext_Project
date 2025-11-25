

import { useState, useRef, useEffect } from "react";
import { AlignJustify, LogOut, Home } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser, checkAuthStatus } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

function AdminHeader({ setOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState(""); // ✅ user name state
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch logged-in user name
  useEffect(() => {
    const fetchUser = async () => {
      const authStatus = await checkAuthStatus();
      if (authStatus.isAuthenticated && authStatus.user) {
        setUserName(authStatus.user.name);
      }
    };
    fetchUser();
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout
  function handleLogout() {
    // logoutUser();
    logout();
    navigate("/shop/home");

  }

  // return (
  //   <header className="flex items-center justify-between px-4 py-3 bg-background border-b relative">
  //     <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
  //       <AlignJustify />
  //       <span className="sr-only">Toggle Menu</span>
  //     </Button>

  //     <div className="flex flex-1 justify-end items-center space-x-4" ref={dropdownRef}>
  //       {/* ✅ User Name Display */}
  //       {userName && (
  //         <span className="font-medium text-gray-800 dark:text-white hidden sm:inline">
  //           Welcome, {userName}
  //         </span>
  //       )}

  //       <Button
  //         onClick={() => setShowDropdown(!showDropdown)}
  //         className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
  //       >
  //         <LogOut />
  //         More Options
  //       </Button>

  //       {showDropdown && (
  //         <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
  //           <button
  //             className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
  //             onClick={handleLogout}
  //           >
  //             <LogOut className="mr-2" size={18} /> Logout
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   </header>
  // );
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b fixed top-0 z-50 w-[100%]">
      <div className="flex items-center gap-2 ">
        {/* 🏠 Home Button */}
        <Button className="flex items-center gap-1 " onClick={() => navigate("/shop/home")} variant="ghost">
  <Home
    size={18}
    
    className="cursor-pointer hover:text-yellow-500 transition-colors"
  />
  <span className="hidden sm:inline">Home</span>
</Button>


  
        {/* ☰ Menu Toggle (Mobile) */}
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
  
      <div className="md:ml-[50%] flex flex-1 items-center space-x-4" ref={dropdownRef}>
        {/* ✅ User Name Display */}
        {userName && (
          <span className="font-medium text-gray-800 dark:text-white hidden sm:inline">
            Welcome, {userName}
          </span>
        )}
  
        <Button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          More Options
        </Button>
  
        {showDropdown && (
          <div className="absolute right-[20%] mt-20 w-48 bg-white shadow-lg rounded-md border z-50">
            <button
              className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
  
}

export default AdminHeader;
