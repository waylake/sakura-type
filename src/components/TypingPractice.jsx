import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Sakura from "./Sakura";
import ThemeToggle from "./ThemeToggle"; // ThemeToggle 컴포넌트 가져오기

const cherryBlossomPoems = [
  {
    title: "Springtime Blossoms",
    content:
      "In the gentle spring breeze, the cherry blossoms dance, painting the sky pink, a fleeting romance.",
  },
  {
    title: "Petals in the Wind",
    content:
      "Petals fall like whispers, soft and serene, a moment of beauty, a delicate dream.",
  },
  {
    title: "Blossom's Embrace",
    content:
      "Under the cherry tree, we share a laugh, as blossoms shower down, nature's sweet photograph.",
  },
];

const TypingPractice = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentText, setCurrentText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const textareaRef = useRef(null);

  const startGame = useCallback(() => {
    const randomPoem =
      cherryBlossomPoems[Math.floor(Math.random() * cherryBlossomPoems.length)];
    setCurrentText(randomPoem.content);
    setTypedText("");
    setWpm(0);
    setAccuracy(100);
    setIsActive(true);
    setScore(0);
    setTimeLeft(60);
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) setHighScore(parseInt(storedHighScore));
  }, []);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score);
      }
      alert("Typing practice has ended.");
      window.close(); // 프로그램 종료
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, highScore]);

  useEffect(() => {
    if (isActive) {
      const wordsTyped = typedText.trim().split(" ").length;
      const minutesPassed = (60 - timeLeft) / 60;
      const newWpm = Math.round(wordsTyped / minutesPassed || 0);
      setWpm(newWpm);

      const correctChars = typedText
        .split("")
        .filter((char, index) => char === currentText[index]).length;
      const newAccuracy =
        Math.round((correctChars / typedText.length) * 100) || 100;
      setAccuracy(newAccuracy);

      setScore(Math.round(newWpm * (newAccuracy / 100)));
    }
  }, [typedText, timeLeft, isActive, currentText]);

  useEffect(() => {
    if (isActive && typedText.length === currentText.length) {
      setIsActive(false);
      alert("You have completed the typing practice!");
      window.close(); // 프로그램 종료
    }
  }, [typedText, currentText, isActive]);

  const handleInput = useCallback(
    (e) => {
      if (isActive) {
        const newTypedText = e.target.value;
        setTypedText(newTypedText);
      }
    },
    [isActive],
  );

  const renderWords = useMemo(() => {
    return currentText.split("").map((char, index) => {
      let className = "text-gray-400";
      if (index < typedText.length) {
        className =
          typedText[index] === char ? "text-green-500" : "text-red-500";
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  }, [currentText, typedText]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex flex-col relative overflow-hidden">
      <ThemeToggle />
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url("/cherry-blossom.svg")' }}
      ></div>
      <Sakura windSpeed={1} />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-3xl">
          <div className="bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 shadow-lg rounded-lg overflow-hidden backdrop-filter backdrop-blur-lg">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-400 mb-4">
                Cherry Blossom Typing Practice
              </h1>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Current Score
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {score}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    High Score
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {highScore}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    WPM
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {wpm}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Accuracy
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {accuracy}%
                  </p>
                </div>
              </div>
              <div className="mb-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-pink-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
              <div className="relative mb-4 bg-white bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg p-3 overflow-hidden backdrop-filter backdrop-blur-md">
                <div className="absolute inset-0 text-lg leading-relaxed p-3 font-mono whitespace-pre-wrap break-all">
                  {renderWords}
                </div>
                <textarea
                  ref={textareaRef}
                  value={typedText}
                  onChange={handleInput}
                  className="w-full h-40 bg-transparent rounded-md focus:outline-none resize-none font-mono text-lg leading-relaxed text-transparent caret-pink-500 relative z-10"
                  placeholder={isActive ? "" : "Start typing here..."}
                  disabled={!isActive}
                  style={{
                    WebkitTextFillColor: "transparent",
                    caretColor: "#EC4899",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </div>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                disabled={isActive}
              >
                {isActive ? "In Progress" : "Start"}
              </button>
              <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                Type as fast as you can and improve your typing skills!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TypingPractice);
