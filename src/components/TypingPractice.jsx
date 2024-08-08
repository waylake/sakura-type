import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Sakura from "./Sakura";
import ThemeToggle from "./ThemeToggle";
import Modal from "./Modal";

const cherryBlossomPoems = [
  {
    title: "Spring's Whisper",
    content:
      "Cherry blossoms dance in the spring breeze, singing the beauty of a fleeting moment.",
  },
  {
    title: "Dance of Petals",
    content:
      "Delicate petals falling gently, nature's ballerinas twirling with the wind.",
  },
  {
    title: "Cherry Blossom Embrace",
    content:
      "Sharing smiles under the cherry tree, dreaming of eternity in a shower of blossoms.",
  },
  {
    title: "Ephemeral Beauty",
    content:
      "Cherry blossoms capture a moment's beauty, eternal charm in their brief existence.",
  },
  {
    title: "Spring's Message",
    content:
      "Cherry blossom scent on the gentle breeze, nature's letter heralding the change of seasons.",
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
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
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
      setModalContent("Typing practice has ended!");
      setShowModal(true);
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
      setModalContent("You've completed the typing practice!");
      setShowModal(true);
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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        startGame();
      }
      if (e.key === "Escape") {
        if (isActive) {
          setIsActive(false);
          setModalContent("Game has been stopped.");
          setShowModal(true);
        } else if (showModal) {
          setShowModal(false);
        }
      }
    },
    [isActive, startGame, showModal],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
          <div className="bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 shadow-lg rounded-lg overflow-hidden backdrop-filter backdrop-blur-md">
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
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 font-mono whitespace-pre-wrap break-all pointer-events-none"
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    padding: "0.75rem",
                  }}
                >
                  {renderWords}
                </div>
                <textarea
                  ref={textareaRef}
                  value={typedText}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  className="w-full h-40 bg-transparent rounded-md focus:outline-none resize-none font-mono relative z-10 backdrop-filter backdrop-blur-sm"
                  placeholder={isActive ? "" : "Start typing here..."}
                  disabled={!isActive}
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    padding: "0.75rem",
                    color: "transparent",
                    caretColor: "#EC4899",
                  }}
                />
              </div>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                disabled={isActive}
              >
                {isActive ? "In Progress" : "Start (Ctrl + Enter)"}
              </button>
              <p className="text-center text-gray-700 dark:text-gray-300 mt-4">
                Type as fast as you can to improve your typing skills! (Stop:
                Esc)
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Notification</h2>
        <p>{modalContent}</p>
        <p className="mt-4 text-sm text-gray-500">
          Press ESC to close this modal
        </p>
      </Modal>
    </div>
  );
};

export default React.memo(TypingPractice);
