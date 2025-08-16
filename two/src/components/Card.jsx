// src/components/Card.jsx
import React, { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';

function Card({ image }) {
  const {
    selectedImage,
    setSelectedImage,
    setBackendImage,
    setFrontendImage,
  } = useContext(UserDataContext);

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030325] border-2 border-[#0000ff83] rounded-2xl overflow-hidden cursor-pointer
        ${selectedImage === image ? 'border-4 border-white shadow-2xl shadow-blue-950' : 'hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white'}`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);  // Reset backend image when a card is selected
        setFrontendImage(null); // Reset frontend image when a card is selected
      }}
    >
      <img src={image} className="h-full object-cover" alt="card" />
    </div>
  );
}

export default Card;
