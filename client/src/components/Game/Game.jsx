import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import "../../styles/Home.css";
import AuthContext from "../context/AuthContext.jsx";
import "../../styles/App.css";
import FailMessage from "../UI/FailMessage";
import WinMessage from "../UI/WinMessage";
import { CircularProgress } from '@mui/joy';
import LeaderboardTable from "../UI/LeaderboardTable.jsx";

const Game = () => {
  const {
    setImg,
    setText,
    totalLevelsCount,
    setTime,
    userData,
    title,
    selectedLevelIndex,
    updateBestWpm,
    setSelectedLevelIndex,
    text,
    Img,
    time,
  } = useContext(AuthContext);
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
  const [startTime, setStartTime] = useState(null);
  const hpPercentage = (hp / text.length) * 100;
  const [timeTaken, setTimeTaken] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const [chatBubble, setChatBubble] = useState({ visible: false, text: `` });
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          text: "Thats all you got?",
        });
        setTimeout(() => {
          setChatBubble({
            visible: false,
            text: "",
          });
        }, 3000);
      }
    }, (Math.random() * (10 - 5) + 5) * 1000);

    return () => clearInterval(intervalId);
  }, [isFinished, hasFailed, timeLeft]);

  const updateLastActivity = async (username, movie, level, wpm) => {
    try {
      const response = await fetch("http://localhost:3000/setLastActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, movie, level, wpm }),
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("Failed to update leaderboard");
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const updateLevelLeaderboard = async (wpm) => {
    try {
      const response = await fetch(
        "http://localhost:3000/updateThemeLevelLeaderboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            wpm,
            theme: title,
            levelIndex: selectedLevelIndex,
          }),
        }
      );

      if (response.ok) {
        await response.json();
      } else {
        console.error("Failed to update level specific leaderboard");
      }
    } catch (error) {
      console.error("Error updating level specific leaderboard:", error);
    }
  };

  const getLevelThemeLeaderboard = async () => {
    try {
      const url = `http://localhost:3000/getThemeLevelLeaderboard?theme=${title}&levelIndex=${selectedLevelIndex}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      } else {
        console.log("Failed to get level specific leaderboard");
      }
    } catch (error) {
      console.log("Error getting level specific leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleWinRequests(wpm) {
    setIsLoading(true);
    setIsLeaderboardVisible(true);
    updateNextLevel(userData.username, title).then(() => {
      updateLastActivity(
          userData.username,
          title,
          selectedLevelIndex,
          wpm
      ).then(() => {
        updateLevelLeaderboard(wpm).then(() => {
          updateBestWpm(userData.username, wpm);
          getLevelThemeLeaderboard();
        });
      });
    });
  }

  const handleClickForBlur = useCallback(() => {
    setIsBlurred(false);
    setIsMessageVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {

      // if first press - start timer for WPM
      if (!hasStartedTyping) {
        setHasStartedTyping(true);
        setStartTime(Date.now());
      }

      setHasStartedTyping(true);
      // check the type of the key pressed
      const key = e.key;
      const expectedLetter = text[currentLetterIndex];
      const isLetter = key.length === 1;
      const isSpace = key === " ";
      const isBackspace = key === "Backspace";

      // get the cursor's position (yellow one)
      const element = document.querySelector(".blinking-cursor");
      const cursorPosY = element.offsetTop;

      // if the cursor's position hasn't been calculated yet, calculate it and increment the calculation counter
      if (!hasCalculated) {
        setNextCursorY(cursorPosY + 100);
        sethasCalculated(true);
        setTimesCalculated(timesCalculated + 1);
      }

      // if the cursor is at the target position and the calculation counter is at 1, update the target position and increment the update counter
      // target - third row
      if (cursorPosY >= nextCursorY && timesCalculated === 1) {
        setNextCursorY(cursorPosY);
        setTimesUpdatedCursor(timesUpdatedCursor + 1);
      }

      // if a letter or a space was pressed, and it's the expected input
      if (isLetter || (isSpace && expectedLetter === " ")) {

        // if the player has typed all the letters in the text
        if (currentLetterIndex >= text.length - 1) {

          // if there were incorrect letters typed, mark the game as failed
          if (incorrectLetters.length > 0) {
            setHasFailed(true);

            // otherwise, mark the game as finished, calculate the time taken, and calculate the typing speed (in words per minute)
          } else {
            setIsFinished(true);
            const timeTaken = time - timeLeft;
            setTimeTaken(timeTaken);
            const durationMs = Date.now() - startTime;
            const durationMin = durationMs / 1000 / 60;
            const wpm = Math.floor(text.split(" ").length / durationMin);
            setWpm(wpm);
            handleWinRequests(wpm);
          }
          return;
        }

        const nextLetterIndex = currentLetterIndex + 1;

        if (key === expectedLetter) {

          // decrease the player's health points, add the index to the correct letters list, and move to the next letter
          setHp(hp - 1);
          setCorrectLetters((prevCorrectLetters) => [
            ...prevCorrectLetters,
            `${currentLetterIndex}`,
          ]);
          setCurrentLetterIndex(nextLetterIndex);

          // if all letters have been typed and there were no incorrect letters, mark the game as Won and Finished and calculate the typing speed
          if (
            nextLetterIndex === text.length &&
            incorrectLetters.length === 0
          ) {
            setIsFinished(true);
            setHasFailed(false);
            const timeTaken = time - timeLeft;
            setTimeTaken(timeTaken);
            const durationMs = Date.now() - startTime;
            const durationMin = durationMs / 1000 / 60;
            const wpm = Math.floor(text.split(" ").length / durationMin);
            setWpm(wpm);
            handleWinRequests(wpm);
          }

          // Ii all letters have been typed but there were incorrect letters, mark the game as failed
          if (nextLetterIndex === text.length && incorrectLetters.length > 0) {
            setHasFailed(true);
          }
        } else if (expectedLetter !== " ") {

          // if the key press does not match the expected letter and the expected letter is not a space, add the index to the incorrect letters list and move to the next letter
          setIncorrectLetters((prevIncorrectLetters) => [
            ...prevIncorrectLetters,
            `${currentLetterIndex}`,
          ]);
          setCurrentLetterIndex(nextLetterIndex);
        }
      }

      if (isBackspace) {

        // If there are previous letters, move back one letter and remove it from the correct and incorrect letters lists
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

          // If the letter was correct, increase the player's health points
          if (correctLetters.includes(`${currentLetterIndex - 1}`)) {
            setHp(hp + 1);
          }
        }
      }

      // don't allow keys to do their default actions like "tab" etc...
      e.preventDefault();
    },
    [
      setHasStartedTyping,
      text,
      currentLetterIndex,
      hasCalculated,
      timesCalculated,
      timesUpdatedCursor,
      incorrectLetters,
      timeLeft,
      time,
    ]
  );

  const updateNextLevel = async (username, movie) => {
    let data;
    if (selectedLevelIndex <= totalLevelsCount) {
      try {
        const res = await fetch(`http://localhost:3000/unlockNextLevel/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, movie, selectedLevelIndex }),
        });
        data = await res.json();
        console.log(data);
      } catch (e) {
        console.error(e);
      }
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

  const resetGameState = (data) => {
    setIsLeaderboardVisible(false);
    setIsLoading(false);
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
    setHp(data.text.length);
    setIsFinished(false);
    setTimeLeft(data.time);
    setTimeTaken(0);
    setWpm(0);
    setHasFailed(false);
    setChatBubble({ visible: false, text: `` });
    setLeaderboardData(null);
  };

  const handleNextLevel = async () => {
    try {
      const response = await fetch(
          `http://localhost:3000/movies/${title}/levels/${selectedLevelIndex + 1}`
      );
      const data = await response.json();
      console.log(data);
      setText(data.text);
      setImg(data.img);
      setTime(data.time);
      setHp(data.text.length);
      setTimeLeft(data.time);
      setSelectedLevelIndex(selectedLevelIndex + 1);
      resetGameState(data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleRetry = () => {
    resetGameState({ text, time });
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
        {isLoading ? (
            <div className="flex items-center justify-center mt-8">
              <CircularProgress color="neutral" variant="plain" size="lg" value={60}/>
            </div>
        ) : (
            leaderboardData && isLeaderboardVisible && <LeaderboardTable leaderboardData={leaderboardData} />
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
