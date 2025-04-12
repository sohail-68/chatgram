import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage
.getItem('token');
      const response = await axios.get('http://localhost:5001/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post._id} className="post">
          <h3>{post.author.username}</h3>
          <img src={post.image} alt={post.caption} />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
