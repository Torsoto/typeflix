import { BiTimeFive } from "react-icons/bi";
import gangster1 from "../../assets/ganster-lv1.png";
import { useState } from "react";
import "../../styles/Home.css";

const HomeGame = () => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);

  const text =
    `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor`.split(" ");

  const handleClickForBlur = () => {
    setIsBlurred(false);
    setIsMessageVisible(false);
  };

  const handleKeyUp = (e) => {
    const key = e.key;
    const currentWord = text[currentWordIndex];
    const currentLetter = currentWord && currentWord[currentLetterIndex];
    const expected = currentLetter || " ";
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";

    if (isLetter) {
      if (key === expected) {
        setCurrentLetterIndex(currentLetterIndex + 1);
        setCorrectLetters([
          ...correctLetters,
          `${currentWordIndex}-${currentLetterIndex}`,
        ]);
      } else {
        setIncorrectLetters([
          ...incorrectLetters,
          `${currentWordIndex}-${currentLetterIndex}`,
        ]);
      }
    }

    if (isSpace && !currentLetter) {
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentLetterIndex(0);
    }

    e.preventDefault();
  };

  return (
    <div className="h-[85%] mx-auto grid place-items-center text-white ">
      <div className="text-2xl text-center">
        <p>Level 1</p>
      </div>
      <div>
        <img
          src={gangster1}
          alt="pixel image of low level thug"
          className="w-[200px] stance mr-8"
        />
      </div>
      <div>
        <div className="flex gap-2">
          {" "}
          <BiTimeFive size={35} className="ml-4" />
          <p className="text-2xl">30</p>
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
            } overflow-hidden flex items-center text-2xl m-auto`}
          >
            <p className="relative p-4 leading-loose text-justify line-clamp-3">
              {text.map((word, wordIndex) => (
                <span
                  key={`${word}-${wordIndex}`}
                  className={wordIndex === currentWordIndex ? "current" : ""}
                >
                  {word.split("").map((letter, letterIndex) => (
                    <>
                      {wordIndex === currentWordIndex &&
                        letterIndex === currentLetterIndex &&
                        !isBlurred && (
                          <span className="fixed z-10 -ml-[3px] -mt-[1.5px] text-yellow-400 blinking-cursor">
                            |
                          </span>
                        )}
                      <span
                        key={`${letter}-${letterIndex}`}
                        className={
                          wordIndex === currentWordIndex &&
                          letterIndex === currentLetterIndex
                            ? "current opacity-100 relative"
                            : correctLetters.includes(
                                `${wordIndex}-${letterIndex}`
                              )
                            ? "opacity-100 relative"
                            : incorrectLetters.includes(
                                `${wordIndex}-${letterIndex}`
                              )
                            ? "opacity-100 text-red-500 relative"
                            : "opacity-60 relative"
                        }
                      >
                        {letter}
                      </span>
                    </>
                  ))}{" "}
                </span>
              ))}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomeGame;
