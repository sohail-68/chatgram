import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaUserCircle, FaCommentDots, FaBell, FaSearch } from 'react-icons/fa'; // Different icons from Font Awesome
import useChatMessages from '../hooks/useChatMessages';
import { io } from 'socket.io-client';
import {
  Home,
  PlusCircle,
  UserCircle,
  MessageCircle,
  Bell,
  Search,
  LogIn,
  LogOut,
} from "lucide-react";
import axios from 'axios';

const data = [
  { label: "Home", icon: <Home className="h-5 w-5" />, link: "/" },
  { label: "Create Post", icon: <PlusCircle className="h-5 w-5" />, link: "/create" },
  { label: "Profile", icon: <UserCircle className="h-5 w-5" />, link: "/profile" },
  { label: "Messages", icon: <MessageCircle className="h-5 w-5" />, link: "/messages" },
  { label: "Notifications", icon: <Bell className="h-5 w-5" />, link: "/noti" },
  { label: "Explore", icon: <Search className="h-5 w-5" />, link: "/explore" },
  { label: "Login", icon: <LogIn className="h-5 w-5" />, link: "/login" },
  { label: "Logout", icon: <LogOut className="h-5 w-5" />, },
];



const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // For controlling sidebar on smaller screens
  const [activeIndex, setActiveIndex] = useState(0);
  const { messages, unreadMessages, setSocket, setMessages, setUnreadMessages } = useChatMessages();

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);
  
    // Join room
    newSocket.emit('joinRoom', sessionStorage.getItem("userid"));
  
    // Listen for messages
    newSocket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setUnreadMessages((prev) => prev + 1);
    });
  
    // Cleanup
    return () => {
      newSocket.off('receiveMessage'); // Ensure listener is removed
      newSocket.disconnect();
    };
  }, [setMessages, setSocket, setUnreadMessages]);

  useEffect(() => {
    if (location.pathname === "/messages") {
      setUnreadMessages(0); // Reset unread messages on Messages page
    }
  }, [location.pathname, setUnreadMessages]);

  useEffect(() => {
  }, [unreadMessages]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional API call to backend if needed
      await axios.post("http://localhost:5001/api/auth/logout", {}, {
        headers: {
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      });

      // Clear token/session on frontend
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userid");
      sessionStorage.removeItem("user");

      // Redirect to login or homepage
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 md:hidden fixed top-0 left-0 z-50"
      >
        <FaHome className="h-8 w-8 text-gray-600 hover:text-gray-900 transition-all duration-300 ease-in-out transform hover:scale-110" />
      </button>

      <div
        className={`fixed top-0 left-0 h-full ${isOpen ? 'w-48' : 'w-64'} bg-white shadow-md z-40 transform transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="xl:p-4 lg:p-4 md:p-4 max-sm:p-1">
          <h1 className="text-2xl font-bold text-center">Instagram Clone</h1>
        </div>

        <nav className="xl:mt-9 lg:mt-10 md:mt-9 sm:mt-14 mt-7 ">
          <ul className="xl:space-y-6 lg:space-y-7 md:p-3 sm:p-4 md:space-y- xl:px-2 max-sm:px-3">
            {data.map((item, index) => (
              <li
                key={index}
                onClick={() => {setActiveIndex(index);setIsOpen(false);item.label==="Logout" && handleLogout() }}
                className={`rounded-lg p-1 transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "bg-slate-950" : ""
                }`}
              >
                <Link
                  to={item.link}
                  className={`flex items-center space-x-4 text-lg font-medium p-2 transition-all duration-300 ease-in-out ${
                    activeIndex === index ? "text-white" : "text-gray-600"
                  } hover:bg-slate-800 hover:text-white rounded-lg`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.label === "Messages" && unreadMessages > 0 && (
                    <span className="ml-2 text-xs text-blue-600 font-bold bg-white rounded-full px-2">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-1">
          <p className=" xl:text-md max-xl:text-sm fixed bottom-0 w-64 text-gray-900">
            © 2025 ChatGram
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
