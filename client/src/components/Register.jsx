// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import imglogin from "../images/login.jpg";

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/register', { username, email, password });
//       navigate('/login');
//     } catch (error) {
//       console.error(error.response.data);
//     }
//   };

//   return (
//     <div className='lg:h-screen bg-black max-lg:h-screen w-[100%]'>
//     <div className='flex p-3 justify-center items-center gap-2 lg:flex-row max-lg:flex-col h-screen'>
//       <div>
// <img src={imglogin} alt="" className='w-[25vw] border-none max-lg:hidden' />

//       </div>
//       <div className='flex-col flex justify-center gap-2 items-center'>
//      <div className='flex-col flex justify-center items-center gap-2'>
//      <h1 className='text-white'>instgarm</h1>
//         <p className='text-white'>Sign up to see photos and videos from your friends.</p>
// <button className='bg-blue-500 p-2 rounded-md text-white'>log in with facebbok</button>
//      </div>
//      <form className='flex mt-2 flex-col justify-center items-center gap-2' onSubmit={handleRegister}>
//       <input type="text" className='text-gray-500 w-[20rem] bg-gray-500 rounded-md p-2'  value={username} placeholder='username' onChange={(e)=>set}/>
//       <input type="text" className='text-gray-500 w-[20rem] bg-gray-500 rounded-md p-2'  placeholder='username' value={email}/>
//       <input type="text" className='text-gray-500 w-[20rem] bg-gray-500 rounded-md p-2'  placeholder='username' value={password}/>
//       <input type="text" className='text-gray-500 w-[20rem] bg-gray-500 rounded-md p-2'  placeholder='username'/>
//       <p className='max-w-md items-center px-6'>People who use our service may have uploaded your contact information to Instagram.   Learn more
// <br />
// By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.

// Have</p>
// <button className='bg-blue-500 p-2 rounded-md text-white'>log in with facebbok</button>
//      </form>

//       </div>

//     </div>

//   </div>
//   );
// };

// export default Register;
