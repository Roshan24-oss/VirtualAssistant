import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import bg from '../assets/humanoids.jpg';
import { UserDataContext } from '../context/UserContext'; // ✅ Fixed import
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl,userData, setUserData } = useContext(UserDataContext); // ✅ Fixed context name
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email,
        password,
      }, { withCredentials: true });

      setUserData(result.data.user); // 🔄 Prefer result.data.user if your backend sends full user
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.error("Signin Error:", error);
      setUserData(null);
      setLoading(false);
      setErr(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}
      className="flex items-center justify-start pl-20"
    >
      <form
        className='w-[90%] h-[600px] max-w-[500px] bg-[#0c0c0c1e] backdrop-blur-lg shadow-xl shadow-black rounded-2xl p-[30px] flex flex-col items-center gap-[20px]'
        onSubmit={handleSignIn}
      >
        <h1 className='text-white text-[30px] font-semibold text-center'>
          Sign In to <span className='text-black'>Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder='Email'
          className='w-full h-[55px] px-[20px] py-[10px] rounded-full border border-cyan-300 bg-transparent text-white placeholder-cyan-200 outline-none'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className='w-full h-[55px] relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full h-full px-[20px] pr-[50px] py-[10px] rounded-full border border-cyan-300 bg-transparent text-white placeholder-cyan-200 outline-none'
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <IoMdEye
              className='absolute top-[15px] right-[18px] w-[24px] h-[24px] text-black cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoIosEyeOff
              className='absolute top-[15px] right-[18px] w-[24px] h-[24px] text-cyan-200 cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err.length > 0 && (
          <p className='text-red-500 text-[17px]'>*{err}</p>
        )}

        <button
          className='w-full h-[55px] mt-[10px] text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition rounded-full text-[18px]'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className='text-black text-[16px] mt-[10px] cursor-pointer hover:underline'
          onClick={() => navigate("/signup")} // ✅ Corrected path
        >
          Want to create a new account? <span className='text-white font-semibold'>Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
