import { BiTimeFive } from "react-icons/bi";
import gangster1 from "../../assets/ganster-lv1.png";
import React, {useState, useCallback, useEffect, useRef, useContext} from "react";
import "../../styles/Home.css";
import AuthContext from "../context/AuthContext.jsx";

const Game = () => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [lineCount,     setLineCount] = useState(0);
  const [nextCursorY, setNextCursorY] = useState(0);
  const [hasCalculated, sethasCalculated] = useState(false);
  const [timesCalculated, setTimesCalculated] = useState(0);
  const [timesUpdatedCursor, setTimesUpdatedCursor] = useState(0);
  const pRef = useRef();
  const { text } = useContext(AuthContext);

  useEffect(() => {
      console.log(text)
  }, [])

    useEffect(() => {
    if (timeLeft > 0 && hasStartedTyping) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [timeLeft, hasStartedTyping]);


  const handleClickForBlur = useCallback(() => {
    setIsBlurred(false);
    setIsMessageVisible(false);
  }, []);

  const handleKeyUp = useCallback(
      (e) => {
        setHasStartedTyping(true);
        const key = e.key;
        const expectedLetter = text[currentLetterIndex];
        const isLetter = key.length === 1;
        const isSpace = key === " ";
        const isBackspace = key === "Backspace";

          const element = document.querySelector('.blinking-cursor');
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
          if (currentLetterIndex === text.length) {
            return;
          }
          const nextLetterIndex = currentLetterIndex + 1;
          if (key === expectedLetter) {
            setCorrectLetters((prevCorrectLetters) => [
              ...prevCorrectLetters,
              `${currentLetterIndex}`,
            ]);
            setCurrentLetterIndex(nextLetterIndex);

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
          }
        }

        e.preventDefault();
      },
      [currentLetterIndex, text, lineCount]
  );

  return (
      <div className="mx-auto grid place-items-center text-white ">
        <div className="mb-[100px]">
          <img
              src={gangster1}
              alt="pixel image of low level thug"
              className="w-[200px] stance mr-8"
          />
        </div>
        <div>
          <div className="flex gap-1 place-content-center">
              <p className={`text-2xl font-bold align-middle ${timeLeft > 0 && !isBlurred ? "opacity-100" : "invisible"}`}>
                    {timeLeft > 0 && !isBlurred ? `${timeLeft}` : "0"}
              </p>
          </div>
          <div className="relative">
            <div
                className={`absolute text-2xl font-mono top-0 bottom-0 left-0 right-0 flex items-center justify-center text-center ${
                    isMessageVisible ? "" : "hidden"
                }`}
            >
              click here to start typing
            </div>
            <main
                tabIndex={0}
                onKeyUp={handleKeyUp}
                onClick={handleClickForBlur}
                className={`max-w-[1200px] ${
                    isBlurred ? "blur" : ""
                } overflow-hidden inline-block items-center h-[155px]  text-2xl m-auto focus:outline-none`}
            >
                <p ref={pRef} className={`relative leading-[50px] text-justify`} style={{top: -50 * timesUpdatedCursor}}>
                    {text.split('').map((letter, letterIndex) => (
                    <React.Fragment key={letterIndex}>
                      {letterIndex === currentLetterIndex && !isBlurred && (
                          <span className="fixed z-10 -ml-[3px] -mt-[1.5px] text-yellow-400 blinking-cursor">
                              |
                          </span>
                      )}
                      <letter
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
                      </letter>
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