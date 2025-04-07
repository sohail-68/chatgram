// src/layouts/MainLayout.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="md:ml-64 flex-1 p-1">
          {children}
        </div>
        {/* <Suggest /> */}
      </div>
    </div>
  );
};

export default MainLayout;
