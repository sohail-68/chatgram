import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookmarkedPosts = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage
.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookmarked', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(response.data);
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="bookmarked-posts-container">
      {bookmarks.map((post) => (
        <div key={post._id} className="post">
          <h3>{post.author.username}</h3>
          <img src={post.image} alt={post.caption} />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default BookmarkedPosts;
