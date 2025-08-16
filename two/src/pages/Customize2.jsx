import React, { useContext, useState } from 'react';
import { UserDataContext } from '../context/UserContext'; // ✅ fixed name
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Customize2() {
  const {
    userData,
    backendImage,
    selectedImage,
    serverUrl,
    setUserData,
  } = useContext(UserDataContext); // ✅ use correct context name

  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage); // Upload custom image
      } else {
        formData.append("imageUrl", selectedImage); // Use predefined image URL
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      console.log(result.data);
      setUserData(result.data);
      setLoading(false);
      navigate("/"); // Go to home page after successful update
    } catch (error) {
      console.error("Error creating assistant:", error);
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
      <IoArrowBackSharp
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]"
        onClick={() => navigate("/customize")}
      />

      <h1 className='text-white mb-[40px] text-[30px] text-center'>
        Enter your <span className='text-blue-200'>Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder='e.g. Shifra'
        className='w-full max-w-[600px] h-[55px] px-[20px] py-[10px] rounded-full border border-cyan-300 bg-transparent text-white placeholder-cyan-200 outline-none'
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[10px]"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Finally create your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  );
}

export default Customize2;
