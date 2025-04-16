// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';
import Post from '../components/Post';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  console.log(posts);
  
const naviagate=useNavigate()
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await fetchPosts();
        setPosts(data);
        
      } catch (error) {
        if(error.status===401){
          naviagate("/login")
        }
        
        console.error(error);
      }
    };
    getPosts();
  }, []);

console.log(posts);

 //posts);
  console.log(posts);
  
  const handleDeleteSuccess = (deletedPostId) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
  };

console.log(posts);

  return (
    <div className='flex flex-col gap-2 p-3'>
      {posts.map((post) => (
        <Post key={post._id} post={post}  handleDeleteSuccess={handleDeleteSuccess}/>
      ))}
    </div>
  );
};

export default Home;
