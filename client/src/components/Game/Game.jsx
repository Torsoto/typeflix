import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import "../../styles/Home.css";
import AuthContext from "../context/AuthContext.jsx";
import "../../styles/App.css";
import FailMessage from "../UI/FailMessage";
import WinMessage from "../UI/WinMessage"

const Game = () => {
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
  const { text, Img, time } = useContext(AuthContext);
  const [hp, setHp] = useState(text.length);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time);
  const hpPercentage = (hp / text.length) * 100;
  const [timeTaken, setTimeTaken] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  const { userData, title, selectedLevelIndex, updateBestWpm, setSelectedLevelIndex, SelectedLevelIndex } = useContext(AuthContext);

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
          updateNextLevel(userData.username, title);
          updateBestWpm(userData.username, wpm)
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
          updateNextLevel(userData.username, title);
          updateBestWpm(userData.username, wpm)
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
      const res = await fetch(`http://localhost:3000/setNextLevel/${username}/${movie}/${selectedLevelIndex}`, {
        method: 'PATCH'
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
      <div className={`w-full border-2 border-black h-4 mb-14 mt-4 max-w-[300px] bg-white rounded-full`}>
        <div
          className={`h-full ${barColor} rounded-full`}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>
    );
  };

  const handleNextLevel = () => {

  }

  const handleRetry = () => {

  }


  return (
    <div className="grid mx-auto text-white place-items-center ">
      <div className="mr-8">
        <img
          src={Img}
          alt="pixel image of low level thug"
          className="h-[200px] stance"
        />
      </div>
      <HpBar hp={hp} />
      <WinMessage isFinished={isFinished} onRetry={handleRetry} timeTaken={timeTaken} wpm={wpm} onNextLevel={handleNextLevel} />
      <FailMessage hasFailed={hasFailed} onRetry={handleRetry} />
      <div>
        <div className="flex gap-1 place-content-center">
          <p className={`text-2xl font-bold align-middle mb-8 ${timeLeft > 0 && !isBlurred && !isFinished && !hasFailed ? "opacity-100" : "invisible"}`}>
            {timeLeft > 0 && !isBlurred ? `${timeLeft}` : "0"}
          </p>
        </div>
        <div className="relative">
          <div
            className={`absolute text-2xl font-mono top-0 bottom-0 left-0 right-0 flex items-center justify-center text-center ${isMessageVisible ? "" : "hidden"
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