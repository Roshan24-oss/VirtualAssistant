import React, { useContext, useState, useEffect, useRef } from "react";
import { UserDataContext } from '../context/UserContext'; // ✅ Fixed import
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { RiMenu3Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import userImg from "../assets/ab.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext); // ✅ Correct casing
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // NEW: Ref to track if greeting was spoken already
  const greetingSpokenRef = useRef(false);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === 'google-search') {
      window.open(`http://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === "instagram-open") {
      window.open('https://www.instagram.com/', '_blank');
    }
    if (type === "facebook-open") {
      window.open(`http://www.facebook.com`, '_blank');
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank');
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        try {
          recognition.start();
          console.log("Recognition restarted");
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e);
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log("recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.resultIndex][0].transcript.trim();

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        recognition.stop();
        setUserText(transcript);
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    // GREETING FIX: Speak greeting only once
    if (userData?.name && !greetingSpokenRef.current) {
      greetingSpokenRef.current = true;
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, What can I help you with?`);
      greeting.lang = "hi-IN";
      window.speechSynthesis.speak(greeting);
    }

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-[15px] p-[20px] overflow-hidden">
      <RiMenu3Fill className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]" onClick={() => setHam(true)} />

      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross2 className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]" onClick={() => setHam(false)} />

        <button
          className='w-full max-w-[300px] h-[55px] text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition rounded-full cursor-pointer text-[18px]'
          onClick={handleLogOut}
        >
          Log Out
        </button>

        <button
          className='w-full max-w-[300px] h-[55px] text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition rounded-full cursor-pointer text-[18px] px-[20px] py-[10px]'
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400" />
        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col">
          {userData?.history?.map((his, index) => (
            <span key={index} className="text-gray-200 text-[18px] truncate">{his}</span> // ✅ Added key
          ))}
        </div>
      </div>

      <button
        className='w-full max-w-[300px] h-[55px] mt-[10px] text-white font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-cyan-500 hover:bg-cyan-600 transition rounded-full cursor-pointer text-[18px]'
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className='w-full max-w-[300px] h-[55px] mt-[10px] text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition absolute top-[100px] right-[200px] rounded-full cursor-pointer text-[18px] px-[20px] py-[10px] hidden lg:block'
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg bg-white">
        <img src={userData?.assistantImage} alt="Assistant" className="h-full object-cover" />
      </div>

      <h1 className="text-white text-[18px] font-semibold">I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="User" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="AI" className="w-[200px]" />}
      <h1 className="text-white text-[18px] font-bold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;
