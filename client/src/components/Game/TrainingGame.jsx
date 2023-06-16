import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import "../../styles/Home.css";
import "../../styles/App.css";

const TrainingGame = () => {
    const [isBlurred, setIsBlurred] = useState(true);
    const [isMessageVisible, setIsMessageVisible] = useState(true);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [correctLetters, setCorrectLetters] = useState([]);
    const [incorrectLetters, setIncorrectLetters] = useState([]);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [lineCount, setLineCount] = useState(0);
    const [nextCursorY, setNextCursorY] = useState(0);
    const [hasCalculated, sethasCalculated] = useState(false);
    const [timesCalculated, setTimesCalculated] = useState(0);
    const [timesUpdatedCursor, setTimesUpdatedCursor] = useState(0);
    const pRef = useRef();
    const [time, setTime] = useState(120)
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(time);
    const [timeTaken, setTimeTaken] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [hasFailed, setHasFailed] = useState(false);
    const [text, setText] = useState("test yo");
    const [Img, setImg] = useState("https://i.imgur.com/gC8ZKJf.png")

    useEffect(() => {
        const fetchRandomWords = async () => {
            try {
                const response = await fetch("http://localhost:3000/training");
                const responseBody = await response.text();
                const data = JSON.parse(responseBody);
                const words = data.words.join(" ");
                setText(words);
            } catch (error) {
                console.error("Error retrieving random words:", error);
            }
        };

        fetchRandomWords();
    }, [setText]);x

    useEffect(() => {
        if (timeLeft > 0 && hasStartedTyping) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
                if (timeLeft === 1) {
                    setHasFailed(true);
                }
            }, 1000);

            return () => clearTimeout(timerId);
        }
    }, [timeLeft, hasStartedTyping]);


    const handleClickForBlur = useCallback(() => {
        setIsBlurred(false);
        setIsMessageVisible(false);
    }, []);

    const handleKeyUp = (e) => {
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
                if (nextLetterIndex === text.length && incorrectLetters.length === 0) {
                    setIsFinished(true);
                    setHasFailed(false);
                    const timeTaken = time - timeLeft;
                    setTimeTaken(timeTaken);
                    const wpm = Math.round((text.split(" ").length / timeTaken) * 60);
                    setWpm(wpm);
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
                }
            }
        }

        e.preventDefault();
    };


    const WinMessage = ({ isFinished, timeTaken, wpm }) => {
        if (!isFinished) return null;

        return (
            <div className="text-2xl">
                Congratulations! You beat this level in {timeTaken} seconds with {wpm} WPM!
            </div>
        );
    };

    const FailMessage = ({ hasFailed }) => {
        if (!hasFailed) return null;

        return <div className="text-2xl">Sorry! You failed this level.</div>;
    };

    const HpBar = () => {
        let barColor = "bg-green-500";

        return (
            <div className={`w-full border-2 border-black h-4 mb-14 mt-4 max-w-[300px] bg-white rounded-full`}>
                <div
                    className={`h-full ${barColor} rounded-full`}
                />
            </div>
        );
    };


    return (
        <div className="grid mx-auto text-white place-items-center ">
            <div className="">
                <img
                    src={Img}
                    alt="pixel image of low level thug"
                    className="w-[200px] h-[200px] stance mr-8"
                />
            </div>
            <HpBar />
            <WinMessage isFinished={isFinished} timeTaken={timeTaken} wpm={wpm} />
            <FailMessage hasFailed={hasFailed} />
            <div>
                <div className="flex gap-1 place-content-center mb-8">
                    <p className={`text-2xl font-bold align-middle ${timeLeft > 0 && !isBlurred && !isFinished && !hasFailed ? "opacity-100" : "invisible"}`}>
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
                        onKeyUp={handleKeyUp}
                        onClick={handleClickForBlur}
                        className={`max-w-[1200px] ${isBlurred ? "blur" : ""
                            } overflow-hidden inline-block items-center h-[155px]  text-2xl m-auto focus:outline-none ${isFinished || hasFailed ? "hidden" : ""
                            }`}
                    >
                        <p ref={pRef} className={`relative leading-[50px] text-justify text-xl font-medium`} style={{ top: -50 * timesUpdatedCursor }}>
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

export default TrainingGame;