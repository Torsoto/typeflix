import { BiTimeFive } from "react-icons/bi";
import gangster1 from "../../assets/ganster-lv1.png";
import { useState } from "react";
import "../../styles/Home.css";

const HomeGame = () => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);

  const text =
    `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor`.split(
      ""
    );

  const handleClickForBlur = () => {
    setIsBlurred(false);
    setIsMessageVisible(false);
  };

  const handleKeyUp = (e) => {
    const key = e.key;
    const expectedLetter = text[currentLetterIndex];
    const isLetter = key.length === 1;
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";

    if (isLetter || (isSpace && expectedLetter === " ")) {
      if (currentLetterIndex === text.length) {
        return;
      }
      const nextLetterIndex = currentLetterIndex + 1;
      if (key === expectedLetter) {
        setCorrectLetters([...correctLetters, `${currentLetterIndex}`]);
        setCurrentLetterIndex(nextLetterIndex);
      } else if (expectedLetter !== " ") {
        setIncorrectLetters([...incorrectLetters, `${currentLetterIndex}`]);
        setCurrentLetterIndex(nextLetterIndex);
      }
    }

    if (isBackspace) {
      if (currentLetterIndex > 0) {
        setCurrentLetterIndex(currentLetterIndex - 1);
        setCorrectLetters(
          correctLetters.filter((item) => item !== `${currentLetterIndex - 1}`)
        );
        setIncorrectLetters(
          incorrectLetters.filter(
            (item) => item !== `${currentLetterIndex - 1}`
          )
        );
      }
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
              {text.map((letter, letterIndex) => (
                <>
                  {letterIndex === currentLetterIndex && !isBlurred && (
                    <span className="fixed z-10 -ml-[3px] -mt-[1.5px] text-yellow-400 blinking-cursor">
                      |
                    </span>
                  )}
                  <span
                    key={`${letter}-${letterIndex}`}
                    className={
                      correctLetters.includes(`${letterIndex}`)
                        ? "current opacity-100 relative"
                        : incorrectLetters.includes(`${letterIndex}`)
                        ? "opacity-100 text-red-500 relative"
                        : "opacity-60 relative"
                    }
                  >
                    {letter}
                  </span>
                </>
              ))}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomeGame;
