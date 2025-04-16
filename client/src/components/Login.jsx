import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChatMessages } from '../context/AuthContext'; // Make sure this path is correct

function App() {
    const { messages, currentUserId,setCurrentUserId,settoken, suggestedUsers, setMessages } = useChatMessages();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/Auth/login', { email, password });
      const userData = response.data.payload.user;
console.log(userData);

      sessionStorage
.setItem('user', JSON.stringify(userData));
      sessionStorage
.setItem('userid', userData.id);
      sessionStorage
.setItem('token', response.data.token);
setCurrentUserId(userData.id)
settoken(response.data.token)
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeInOut' },
    },
    hover: { rotateY: 15, rotateX: -10, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      background: 'linear-gradient(45deg, #6B73FF, #000DFF)',
      boxShadow: '0px 10px 20px rgba(0, 0, 255, 0.5)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#6B73FF] via-[#ddd6f3] to-[#faaca8] px-4 sm:px-8 lg:px-16 xl:px-32">
      <motion.div
        className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-xl p-8 max-w-md w-full"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-100 mb-8 text-sm sm:text-base">
          Enter your credentials to access your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label htmlFor="email" className="block text-white text-sm sm:text-base mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <label htmlFor="password" className="block text-white text-sm sm:text-base mb-2">
              Password
            </label>
            <input
              id="password"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
              required
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-300 cursor-pointer"
            >
              {show ? 'Hide' : 'Show'}
            </span>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 shadow-lg hover:shadow-blue-700 transition"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Log In
          </motion.button>
        </form>

        <div className="mt-6 text-center text-gray-100">
          <button className="hover:underline text-sm sm:text-base">Forgot Password?</button>
        </div>

        <div className="mt-4 text-center text-gray-100 text-sm sm:text-base">
          Don’t have an account?{' '}
          <Link className="text-blue-400 hover:underline cursor-pointer" to={"/signup"}>
            Sign Up
          </Link>
        </div>

        {/* 3D Rotating Effect */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.1))',
            filter: 'blur(10px)',
            zIndex: -1,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}

export default App;
