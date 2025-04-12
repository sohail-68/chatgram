import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/notification", {
          headers: { Authorization: `${sessionStorage.getItem('token')}` }
        });
        setNotifications(response.data);
      } catch (err) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
console.log(notifications);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  // Assuming current user ID is stored in session storage
  const currentUserId = localStorage.getitem("userid");

  // Filter notifications to only include those with likes from other users
  const filteredNotifications = notifications.filter(notification => 
    notification.likes.some(like => like.user !== currentUserId)
  );
 //filteredNotifications);
  
console.log(notifications);

  return (
    <div className="notifications bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">Notifications</h3>
      {filteredNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {filteredNotifications.map((notification) => (
            <li key={notification._id} className="notification-item mb-4">
              <div className="flex items-start space-x-3">
                
                {/* User Profile Picture */}
          {
            notification.likes.map((user)=>{
             //user);
              
              return(
                <>
                <img src={user.user.profilePicture} alt=""  className='w-10 h-10'/>
                {user.user.username || "Unknown User"}

                </>
              )
              
            })
          }
                
                <div className="flex-1">
                  <div className="text-sm text-gray-800">
                    <span className="font-semibold">
                      {/* {notification.user?.username || "Unknown User"} */}
                    </span>
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
                  
                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-1">2h ago</p>
                </div>

                {/* Notification Image */}
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
