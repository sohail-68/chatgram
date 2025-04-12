import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://chatgram-backend-934g.onrender.com/api/auth/register', { username, email, password });

      // Assuming user data is returned after successful sign-up
      const userData = response.data.payload.user;

      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('userid', userData.id);
      sessionStorage.setItem('token', response.data.token);

      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  // Form animations
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
    <div className="min-h-screen max-md:p-3 flex items-center justify-center bg-gradient-to-br from-[#6B73FF] via-[#ddd6f3] to-[#faaca8]">
      <motion.div
        className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-8 max-w-md w-full"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-6">Sign Up</h2>
        <p className="text-center text-gray-300 mb-8">Create an account to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label htmlFor="username" className="block text-gray-200 text-sm mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
              required
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <label htmlFor="email" className="block text-gray-200 text-sm mb-2">
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

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <label htmlFor="password" className="block text-gray-200 text-sm mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-300 cursor-pointer"
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 shadow-lg hover:shadow-blue-700 transition"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Error Message */}
        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}

        <div className="mt-6 text-center text-gray-300">
          <button className="hover:underline" onClick={() => navigate('/login')}>
            Already have an account? Log in
          </button>
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

export default SignUp;
