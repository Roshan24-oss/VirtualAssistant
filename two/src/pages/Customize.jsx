// src/pages/Customize.jsx
import React, { useContext, useRef } from 'react';
import Card from '../components/Card'; 
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.avif";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.webp";
import image5 from "../assets/image5.avif";
import image6 from "../assets/image6.webp";
import image7 from "../assets/image7.jpg";
import { LuImageUp } from "react-icons/lu";
import { UserDataContext } from '../context/UserContext';  // ✅ Fixed import
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    backendImage,
    setBackendImage,
  } = useContext(UserDataContext);  // ✅ Fixed usage

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage("input");
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px]">
      <IoArrowBackSharp
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]"
        onClick={() => navigate("/")}
      />
      <h1 className='text-white mb-[40px] text-[30px] text-center'>
        Select your <span className='text-blue-200'>Assistant Image</span>
      </h1>

      <div className='w-full max-w-[60%] flex justify-center items-center flex-wrap gap-[15px]'>
        {[image1, image2, image3, image4, image5, image6, image7].map((img, i) => (
          <Card key={i} image={img} />
        ))}

        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030325] border-2 border-[#0000ff83] rounded-2xl overflow-hidden hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
            selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && <LuImageUp className='text-white w-[25px] h-[25px]' />}
          {frontendImage && <img src={frontendImage} className='h-full object-cover' alt="Selected" />}
        </div>

        <input
          type="file"
          accept='image/*'
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[10px]'
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
