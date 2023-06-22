import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import "../../styles/Home.css";
import AuthContext from "../context/AuthContext.jsx";
import "../../styles/App.css";
import FailMessage from "../UI/FailMessage";
import WinMessage from "../UI/WinMessage"
import {CircularProgress} from "@material-ui/core";
import {Link} from "react-router-dom";

const Game = () => {
  const { setImg, setText, setTime, userData, title, selectedLevelIndex, updateBestWpm, setSelectedLevelIndex, text, Img, time } = useContext(AuthContext);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [nextCursorY, setNextCursorY] = useState(0);
  const [hasCalculated, sethasCalculated] = useState(false);
  const [timesCalculated, setTimesCalculated] = useState(0);
  const [timesUpdatedCursor, setTimesUpdatedCursor] = useState(0);
  const pRef = useRef();
  const [hp, setHp] = useState(text.length);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time);
  const hpPercentage = (hp / text.length) * 100;
  const [timeTaken, setTimeTaken] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const [chatBubble, setChatBubble] = useState({ visible: false, text: `` });
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [leaderboardAvatars, setLeaderboardAvatars] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && hasStartedTyping && !isFinished && !hasFailed) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft === 1) {
          setHasFailed(true);
        }
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [timeLeft, hasStartedTyping, isFinished, hasFailed]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isFinished && !hasFailed && timeLeft > 0) {
        setChatBubble({
          visible: true,
          text: 'Thats all you got?'
        });
        setTimeout(() => {
          setChatBubble({
            visible: false,
            text: ''
          });
        }, 3000);
      }
    }, (Math.random() * (10 - 5) + 5) * 1000);

    return () => clearInterval(intervalId);
  }, [isFinished, hasFailed, timeLeft]);

  useEffect(() => {
    console.log(leaderboardData)
    const fetchLeaderboardAvatars = async () => {
      const usernames = Object.keys(leaderboardData);
      const avatarResponses = await Promise.all(
          usernames.map(username =>
              fetch(`http://localhost:3000/getAvatar?username=${username}`)
                  .then(response => response.text())
                  .then(avatar => ({ username, avatar }))
          )
      );

      const avatars = {};
      avatarResponses.forEach(response => {
        avatars[response.username] = response.avatar;
      });

      setLeaderboardAvatars(avatars);
    };

    if (leaderboardData) {
      fetchLeaderboardAvatars();
    }
  }, [leaderboardData]);

  const updateLastActivity = async (username, movie, level, wpm) => {
    try {
      const response = await fetch('http://localhost:3000/setLastActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, movie, level,  wpm}),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Failed to update leaderboard');
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  const updateLevelLeaderboard = async (wpm) => {
    try {
      const response = await fetch('http://localhost:3000/updateThemeLevelLeaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userData.username, wpm, theme: title, levelIndex: selectedLevelIndex }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Failed to update level specific leaderboard');
      }
    } catch (error) {
      console.error('Error updating level specific leaderboard:', error);
    }
  };

  const getLevelThemeLeaderboard = async () => {
    setIsLoading(true);
    try {
      const url = `http://localhost:3000/getThemeLevelLeaderboard?theme=${title}&levelIndex=${selectedLevelIndex}`;
      const response = await fetch(url);

      console.log(title, selectedLevelIndex, url);

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        setLeaderboardData(data);
      } else {
        console.log('Failed to get level specific leaderboard');
      }
    } catch (error) {
      console.log('Error getting level specific leaderboard:', error);
    }
  };

  function handleWinRequests() {
    updateNextLevel(userData.username, title).then(() => {
      updateLastActivity(userData.username, title, selectedLevelIndex, wpm).then(() => {
        updateLevelLeaderboard(wpm).then(() => {
          updateBestWpm(userData.username, wpm)
        });
      });
    });
    getLevelThemeLeaderboard();
  }

  const handleClickForBlur = useCallback(() => {
    setIsBlurred(false);
    setIsMessageVisible(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    setHasStartedTyping(true);
    const key = e.key;
    const expectedLetter = text[currentLetterIndex];
    const isLetter = key.length === 1;
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";

    const element = document.querySelector(".blinking-cursor");
    const cursorPosY = element.offsetTop;

    if (!hasCalculated) {
      setNextCursorY(cursorPosY + 100);
      sethasCalculated(true);
      setTimesCalculated(timesCalculated + 1);
    }

    if (cursorPosY >= nextCursorY && timesCalculated === 1) {
      setNextCursorY(cursorPosY);
      setTimesUpdatedCursor(timesUpdatedCursor + 1);
    }

    if (isLetter || (isSpace && expectedLetter === " ")) {
      if (currentLetterIndex >= text.length - 1) {
        if (incorrectLetters.length > 0) {
          setHasFailed(true);
        } else {
          setIsFinished(true);
          setHp(hp - 1)
          const timeTaken = time - timeLeft;
          setTimeTaken(timeTaken);
          const wpm = Math.round((text.split(" ").length / timeTaken) * 60);
          setWpm(wpm);
          handleWinRequests();
        }
        return;
      }
      const nextLetterIndex = currentLetterIndex + 1;
      if (key === expectedLetter) {
        setHp(hp - 1);
        setCorrectLetters((prevCorrectLetters) => [
          ...prevCorrectLetters,
          `${currentLetterIndex}`,
        ]);
        setCurrentLetterIndex(nextLetterIndex);
        if (nextLetterIndex === text.length && incorrectLetters.length === 0) {
          setIsFinished(true);
          setHasFailed(false);
          const timeTaken = time - timeLeft;
          setTimeTaken(timeTaken);
          const wpm = Math.round((text.split(" ").length / timeTaken) * 60);
          setWpm(wpm);
          handleWinRequests();
        }
        if (nextLetterIndex === text.length && incorrectLetters.length > 0) {
          setHasFailed(true);
        }
      } else if (expectedLetter !== " ") {
        setIncorrectLetters((prevIncorrectLetters) => [
          ...prevIncorrectLetters,
          `${currentLetterIndex}`,
        ]);
        setCurrentLetterIndex(nextLetterIndex);
      }
    }

    if (isBackspace) {
      if (currentLetterIndex > 0) {
        setCurrentLetterIndex(currentLetterIndex - 1);
        setCorrectLetters((prevCorrectLetters) =>
          prevCorrectLetters.filter(
            (item) => item !== `${currentLetterIndex - 1}`
          )
        );
        setIncorrectLetters((prevIncorrectLetters) =>
          prevIncorrectLetters.filter(
            (item) => item !== `${currentLetterIndex - 1}`
          )
        );
        if (correctLetters.includes(`${currentLetterIndex - 1}`)) {
          setHp(hp + 1);
        }
      }
    }

    e.preventDefault();
  }, [setHasStartedTyping, text, currentLetterIndex, hasCalculated, timesCalculated, timesUpdatedCursor, incorrectLetters, timeLeft, time]);

  const updateNextLevel = async (username, movie) => {
    try {
      const res = await fetch(`http://localhost:3000/unlockNextLevel/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, movie, selectedLevelIndex}),
      });

      const data = await res.json();
    } catch (e) {
      console.error(e);
    }
  };

  const HpBar = ({ hp }) => {
    let barColor = "bg-green-500";
    if (hpPercentage < 20) {
      barColor = "bg-red-500";
    } else if (hpPercentage < 50) {
      barColor = "bg-orange-500";
    }

    return (
      <div className={`w-full border-2 border-black h-4 mb-10 mt-4 max-w-[500px] bg-white rounded-full`}>
        <div
          className={`h-full ${barColor} rounded-full`}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>
    );
  };

  const handleNextLevel = async () => {
    try {
      const response = await fetch(
          `http://localhost:3000/movies/${title}/levels/${selectedLevelIndex+1}`
      );
      await response.json().then((data) => {
        handleRetry();
        setText(data.text);
        setImg(data.img);
        setTime(data.time);
        setHp(data.text.length);
        setTimeLeft(data.time);
        setSelectedLevelIndex(selectedLevelIndex + 1);
        setLeaderboardData(null);
        setLeaderboardAvatars({});
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleRetry = () => {
    setIsBlurred(true);
    setIsMessageVisible(true);
    setCurrentLetterIndex(0);
    setCorrectLetters([]);
    setIncorrectLetters([]);
    setHasStartedTyping(false);
    setNextCursorY(0);
    sethasCalculated(false);
    setTimesCalculated(0);
    setTimesUpdatedCursor(0);
    setHp(text.length);
    setIsFinished(false);
    setTimeLeft(time);
    setTimeTaken(0);
    setWpm(0);
    setHasFailed(false);
    setChatBubble({ visible: false, text: `` });
    setLeaderboardData(null);
    setLeaderboardAvatars({});
  };


  return (
    <div className="grid mx-auto text-white place-items-center ">
      <div className="relative mr-8">
        {chatBubble.visible && (
          <div className="absolute top-0 z-50 p-2 text-black bg-white rounded-md -left-20 chat-bubble">
            {chatBubble.text}
          </div>
        )}
        <img
          src={Img}
          alt="image of enemy"
          className="h-[250px] z-10 stance"
        />
      </div>
      <HpBar hp={hp} />
      <WinMessage isFinished={isFinished} onRetry={handleRetry} timeTaken={timeTaken} wpm={wpm} onNextLevel={handleNextLevel} />
      <FailMessage hasFailed={hasFailed} onRetry={handleRetry} />
      {leaderboardData &&(
          <div className="flex flex-col w-full max-w-md px-4 py-2 mt-8">
            <div className="overflow-hidden rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Username
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    WPM
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(leaderboardData).map(([username, wpm], i) => (
                    <tr key={username} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="flex items-center px-6 py-4 text-sm text-gray-900">
                        <img
                            src={leaderboardAvatars[username]}
                            alt="Avatar"
                            className="w-8 h-8 bg-white rounded-full"
                        />
                        <div className="ml-2">
                          <Link to={`/${username}`}>
                            {username}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-500">{wpm}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
      )}
      <div>
        <div className="flex gap-1 place-content-center">
          <p className={`text-2xl font-bold align-middle mb-4 ${timeLeft > 0 && !isBlurred && !isFinished && !hasFailed ? "opacity-100" : "invisible"}`}>
            {timeLeft > 0 && !isBlurred ? `${timeLeft}` : "0"}
          </p>
        </div>
        <div className="relative">
          <div
            className={`absolute text-2xl font-mono top-0 bottom-24 left-0 right-0 flex items-center justify-center text-center ${isMessageVisible ? "" : "hidden"
              }`}
          >
            click here to start typing
          </div>
          <main
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={handleClickForBlur}
            className={`max-w-[1200px] ${isBlurred ? "blur" : ""
              } overflow-hidden inline-block items-center h-[155px]  text-2xl m-auto focus:outline-none ${isFinished || hasFailed ? "hidden" : ""
              }`}
          >
            <p ref={pRef} className={`relative leading-[50px] text-justify text-2xl font-medium`} style={{ top: -50 * timesUpdatedCursor }}>
              {text.split('').map((letter, letterIndex) => (
                <React.Fragment key={letterIndex}>
                  {letterIndex === currentLetterIndex && !isBlurred && (
                    <span className="fixed z-10 -ml-[3px] -mt-[1.5px] text-yellow-400 blinking-cursor">
                      |
                    </span>
                  )}
                  <span
                    key={`${letter}-${letterIndex}`}
                    className={
                      letterIndex === currentLetterIndex
                        ? "current opacity-60 relative transition-color"
                        : correctLetters.includes(`${letterIndex}`)
                          ? "opacity-100 relative transition-color"
                          : incorrectLetters.includes(`${letterIndex}`)
                            ? "opacity-100 text-red-500 relative transition-color"
                            : "opacity-60 relative transition-color"
                    }
                  >
                    {letter}
                  </span>
                </React.Fragment>
              ))}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Game;