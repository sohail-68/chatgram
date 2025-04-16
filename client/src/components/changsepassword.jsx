import axios from "axios";
import React, { useState } from "react";

const ChangePassword = () => {
  const [password, setPassword] = useState({
    oldpass: "",
    newpass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const SubPass = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5001/api/auth/changepass",
        {
          currentPassword: password.oldpass,
          newPassword: password.newpass,
        },
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Password changed successfully:", response.data);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      alert("Failed to change password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Change Password
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              name="oldpass"
              value={password.oldpass}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              name="newpass"
              value={password.newpass}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={SubPass}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
