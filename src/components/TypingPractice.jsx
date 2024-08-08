import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import words from "an-array-of-english-words";
import Sakura from "./Sakura";

const TypingPractice = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWords, setCurrentWords] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isActive, setIsActive] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const textareaRef = useRef(null);

  const getRandomWords = useCallback((count) => {
    return Array.from(
      { length: count },
      () => words[Math.floor(Math.random() * words.length)],
    );
  }, []);

  const startGame = useCallback(() => {
    setTimeLeft(60);
    setTypedText("");
    setWpm(0);
    setAccuracy(100);
    setIsActive(true);
    setCurrentWords(getRandomWords(100));
    setScore(0);
    textareaRef.current?.focus();
  }, [getRandomWords]);

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
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, highScore]);

  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) setHighScore(parseInt(storedHighScore));
  }, []);

  useEffect(() => {
    if (isActive) {
      const wordsTyped = typedText.trim().split(" ").length;
      const minutesPassed = (60 - timeLeft) / 60;
      const newWpm = Math.round(wordsTyped / minutesPassed || 0);
      setWpm(newWpm);

      const correctChars = typedText
        .split("")
        .filter((char, index) => char === currentWords.join(" ")[index]).length;
      const newAccuracy =
        Math.round((correctChars / typedText.length) * 100) || 100;
      setAccuracy(newAccuracy);

      setScore(Math.round(newWpm * (newAccuracy / 100)));
      setLevel(Math.floor(score / 100) + 1);
    }
  }, [typedText, timeLeft, isActive, currentWords, score]);

  const handleInput = useCallback(
    (e) => {
      if (isActive) {
        const newTypedText = e.target.value;
        setTypedText(newTypedText);

        // 단어 완성 시 처리
        if (newTypedText.endsWith(" ")) {
          const typedWords = newTypedText.trim().split(" ");
          const lastTypedWord = typedWords[typedWords.length - 1];
          const currentWord = currentWords[0];

          if (lastTypedWord === currentWord) {
            setCurrentWords((prevWords) => {
              const newWords = [...prevWords.slice(1), ...getRandomWords(1)];
              return newWords;
            });
            setTypedText("");
          }
        }
      }
    },
    [isActive, currentWords, getRandomWords],
  );

  const renderWords = useMemo(() => {
    const words = currentWords.join(" ").split("");
    return words.map((char, index) => {
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
  }, [currentWords, typedText]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url("/cherry-blossom.svg")' }}
      ></div>
      <Sakura windSpeed={1} />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-3xl">
          <div className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 shadow-lg rounded-lg overflow-hidden backdrop-filter backdrop-blur-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Level
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {level}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Score
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {score}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    High Score
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {highScore}
                  </p>
                </div>
              </div>
              <div className="mb-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-pink-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
              <div className="relative mb-4 bg-white bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg p-3 overflow-hidden">
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
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
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
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  disabled={isActive}
                >
                  {isActive ? "In Progress" : "Start"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default React.memo(TypingPractice);
