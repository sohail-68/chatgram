import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Suggest = () => {
  const [suggested, setSuggest] = useState([]);

  async function fetchSuggestedUsers() {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/suggested-users', {
        headers: {
          Authorization: sessionStorage.getItem("token")
        }
      });
     //response.data);
      setSuggest(response.data);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  }

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  return (
    <div className="mt-6 max-lg:hidden space-y-4">
    {window.location.pathname === "/" &&
      suggested.map((item, index) => (
        <Link to={`/userprofile/${item._id}`}
          key={item.id || index}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 bg-white/30 backdrop-blur-lg rounded-xl shadow-md border border-white/20 p-4 transition-all duration-300"
        >
          {/* Profile Image */}
          <img
            src={item.profilePicture}
            alt={`${item.username}'s profile`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-white shadow"
          />
  
          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-gray-900 text-base sm:text-lg">
              {item.username}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Joined:{" "}
              <span className="font-medium">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </Link>
      ))}
  </div>
  

  );
};

export default Suggest;
