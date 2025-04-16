import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  UserCircle,
  MessageCircle,
  Search,
} from 'lucide-react';
// import { useChatMessages } from '../hooks/useChatMessages'

const tabs = [
  { label: "Home", icon: Home, link: "/" },
  { label: "Explore", icon: Search, link: "/explore" },
  { label: "Post", icon: PlusCircle, link: "/create" },
  { label: "Messages", icon: MessageCircle, link: "/messages" },
  { label: "Profile", icon: UserCircle, link: "/profile" },
];

const MobileTabs = () => {
  // const { unreadMessages } = useChatMessages();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t shadow-md z-50 flex justify-between px-6 py-2 md:hidden">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={index}
            to={tab.link}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-400'
              }`
            }
          >
            <div className="relative">
              <Icon className="h-6 w-6" />
              {/* Uncomment if you use unread messages */}
              {/* {tab.label === "Messages" && unreadMessages > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {unreadMessages}
                </span>
              )} */}
            </div>
            <span className="text-xs">{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileTabs;
