// src/layouts/MainLayout.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";
import MobileTabs from "../components/MobileTabs";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location=useLocation()
  console.log(location);

  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="md:ml-64 flex-1 ">
          {children}
        </div>
        <div className="p-2">
          <Suggest/>
        </div>
        {/* <Suggest /> */}
        {!location.pathname.includes("/message") && <MobileTabs />}
        
      </div>
    </div>
  );
};

export default MainLayout;
