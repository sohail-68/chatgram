import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Suggest = () => {
  const [suggested, setSuggest] = useState([]);

  async function fetchSuggestedUsers() {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/suggested-users', {
        headers: {
          Authorization: localStorage.getitem("token")
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
    <div className='mt-3 max-lg:hidden'>

      {window.location.pathname === "/" && (
        suggested.map((item, index) => (
    <div className='xl:p-3 max-md:p-1 rounded-lg shadow-lg mr-3'>
          <div key={item.id || index} className='flex xl:justify-center xl:items-center w-full  max-md:flex-col  max-md:items-center max-md:justify-center gap-2'>
            <img
              src={item.profilePicture}
              alt={`${item.username}'s profile`}
              className='w-20 h-20 rounded-full'
            />
            <div className='flex flex-col'>
              <p className="font-bold">{item.username}</p>
              <p className="text-sm text-gray-500">
                Created on: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
    </div>
          </div>
        ))
      )}
    </div>

  );
};

export default Suggest;
