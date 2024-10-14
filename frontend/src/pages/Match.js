import "../styles/Match.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../PeerPrep_logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUserCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";

const NOTIFICATION_SERVICE = "http://localhost:5000";
const userId = localStorage.getItem("userId");
const topics = [
  "Algorithms",
  "Arrays",
  "Bit Manipulation",
  "Brainteaser",
  "Databases",
  "Data Structures",
  "Recursion",
  "Strings",
];
const difficulties = ["Easy", "Medium", "Hard"];

export const Match = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(false);
  const [socket, setSocket] = useState(null);
  const [timer, setTimer] = useState(0);

  // Timer
  useEffect(() => {
    let interval;
    let startTime;

    if (isMatching) {
      startTime = Date.now();

      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimer(elapsed);

        if (elapsed >= 30) {
          stopMatching();
        }
      }, 1000);
    } else {
      setTimer(0); // Reset timer when not matching
    }
    return () => clearInterval(interval); // Cleanup interval
  }, [isMatching]);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleProfileButton = (e) => {
    navigate("/profile");
  };

  const startMatching = async (e) => {
    e.preventDefault();
    if (!selectedTopic || !selectedDifficulty) {
      alert("Please choose a topic and difficulty level.");
      return;
    }
    setIsMatching(true);
    setTimer(0);

    try {
      // TO BE COMPLETED: MATCHING SERVICE API CALL
      // const response = await axios.post(MATCHING_SERVICE, {
      //   topic: selectedTopic,
      //   difficulty: selectedDifficulty,
      // });

      // Establish WebSocket connection to notification service
      const socket = io(NOTIFICATION_SERVICE, {
        query: { role: "user", user_id: userId },
        transports: ["websocket"],
      });

      setSocket(socket);
      socket.on("connect", () => {
        console.log("Connected to notification service!");
      });

      socket.on("notification", (data) => {
        alert(`You have been matched with ${data.data}!`);
        stopMatching();
      });

      socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
        setIsMatching(false);
      });
    } catch (error) {
      console.error("Error:", error);
      stopMatching();
    }
  };

  const stopMatching = () => {
    if (socket?.connected) socket.disconnect();
    setIsMatching(false);
    setTimer(0);
  };

  return (
    <div className="match">
      {/* Menu Bar */}
      <nav className="menu-bar">
        <img src={logo} alt="PeerPrep" className="logo" />
        <FontAwesomeIcon
          icon={faUserCircle}
          className="profile-icon"
          style={{ cursor: "pointer" }}
          onClick={handleProfileButton}
        />
      </nav>

      {/* Main Content */}
      <div className="main-container">
        {/* Topics */}
        <div className="topics-container">
          <h2>Choose ONE topic</h2>
          <ul>
            {topics.map((topic, index) => (
              <li
                key={index}
                className={selectedTopic === topic ? "selected" : ""}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Difficulty */}
        <div className="difficulty-container">
          <h2>Choose ONE Difficulty level</h2>
          <ul>
            {difficulties.map((difficulty, index) => (
              <li
                key={index}
                className={selectedDifficulty === difficulty ? "selected" : ""}
                onClick={() => handleDifficultyClick(difficulty)}
              >
                {difficulty}
                {difficulty === "Easy" && (
                  <>
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </>
                )}
                {difficulty === "Medium" && (
                  <>
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </>
                )}
                {difficulty === "Hard" && (
                  <>
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Match Button and Timer */}
        <div className="match-button-container">
          {isMatching && (
            <div className="timer">
              <p>Matching in progress... {timer}s</p>
              <FontAwesomeIcon icon={faSpinner} className="spin" />
            </div>
          )}
          <button
            className="match-button"
            onClick={isMatching ? stopMatching : startMatching}
          >
            {isMatching ? "Cancel" : "Start Matching"}
          </button>
        </div>
      </div>
    </div>
  );
};