import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [img, setimg] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/notification", {
          headers: { Authorization: `${sessionStorage.getItem('token')}` }
        });
        setNotifications(response.data);
        console.log(response);
        
        const setimages=response.data.map((item)=>item.image)
        console.log(setimages);
        
       // Step 1: Extract all image strings
       const images = response.data
       .map(item => item.image) // extract image
       .filter(Boolean); // remove null/undefined if any

     // Step 2: Save to img state
     setimg(images); 
      } catch (err) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
console.log(notifications);
console.log(img);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  // Assuming current user ID is stored in session storage
  const currentUserId = sessionStorage.getItem("userid");

  // Filter notifications to only include those with likes from other users
  const filteredNotifications = notifications.filter(notification => 
    notification.likes.some(like => like.user !== currentUserId)
  );
 //filteredNotifications);
  
console.log(notifications);

  return (
    <div className="notifications bg-white p-4 h-screen justify-center rounded-lg shadow-md max-w-md ">
      <h3 className="text-lg font-bold mb-4">Notifications</h3>
      {filteredNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
        {filteredNotifications.map((notification) => (
  <li key={notification._id} className="notification-item mb-4">
    <div className="flex space-x-4 items-start">
      {/* Left Column: Users who liked/commented (stacked vertically) */}
      <div className="flex flex-col space-y-2">
        {notification.likes.map((user, index) => (
          <div key={index} className="flex items-center space-x-2">
            <img
              src={user.user.profilePicture}
              alt={user.user.username || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm">{user.user.username || "Unknown User"}</span>
          </div>
        ))}
      </div>

      {/* Middle Column: Notification Text */}
      <div className="flex-1">
        <div className="text-sm text-gray-800">
          <span className="ml-1 text-gray-600">
            {notification.likes?.length > 0 && notification.comments?.length > 0
              ? "liked and commented on your post"
              : notification.likes?.length > 0
              ? "liked your post"
              : notification.comments?.length > 0
              ? "commented on your post"
              : "posted an update"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">2h ago</p>
      </div>

      {/* Right Column: Notification Image */}
      {notification.image && (
        <div>
          <img
            src={notification.image}
            alt="Notification related"
            className="w-16 h-16 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default Notifications;
