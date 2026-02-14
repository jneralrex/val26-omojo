import { useState } from 'react';

const WORD_PUZZLES = [
  { word: 'OMOJO', hint: 'What name do I call you most?' },
  { word: 'AWESOME', hint: 'My best description of your personality?' },
];

const SHAME_MESSAGES = [
  '🤦 Oops! Try again!',
  '😅 Nope! Think harder!',
  '😂 Ohhh no! Almost there!',
  '🙈 Not quite... you got this!',
  '💪 That\'s not it... keep going!',
  '😜 Wrong answer, my friend!',
  '🎯 Nice try, but keep swinging!',
  '❌ Nope nope nope! Try again!',
];

const SUCCESS_MESSAGES = [
  'Oil de your head!',
  'Awesome! You de para!',
];

const PasswordPage = ({ onSuccess }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [solved, setSolved] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [letters, setLetters] = useState(() => shuffleLetters(WORD_PUZZLES[0].word));
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  function shuffleLetters(word) {
    const allLetters = word.split('');
    const extraLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const combined = [...allLetters, ...extraLetters.filter(() => Math.random() > 0.5)].slice(0, 12);
    return combined.sort(() => Math.random() - 0.5).map((letter, idx) => ({
      id: idx,
      letter,
      used: false,
    }));
  }

  const currentWord = WORD_PUZZLES[currentPuzzleIndex].word;
  const currentHint = WORD_PUZZLES[currentPuzzleIndex].hint;

  const handleLetterClick = (id) => {
    const letter = letters.find((l) => l.id === id);
    if (!letter.used) {
      setCurrentGuess(currentGuess + letter.letter);
      setLetters(letters.map((l) => (l.id === id ? { ...l, used: true } : l)));
    }
  };

  const handleGuessLetterClick = (index) => {
    const letter = currentGuess[index];
    const letterObj = letters.find((l) => l.letter === letter && l.used);
    setCurrentGuess(currentGuess.slice(0, index) + currentGuess.slice(index + 1));
    if (letterObj) {
      setLetters(letters.map((l) => (l.id === letterObj.id ? { ...l, used: false } : l)));
    }
  };

  const handleClear = () => {
    const usedLetters = letters.filter((l) => l.used);
    setLetters(letters.map((l) => ({ ...l, used: false })));
    setCurrentGuess('');
    setError('');
  };

  const handleSubmit = () => {
    if (currentGuess === currentWord) {
      setError('');
      const newSolved = [...solved, currentWord];
      setSolved(newSolved);

      // Show success message
      setSuccessMessage(SUCCESS_MESSAGES[currentPuzzleIndex]);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        if (newSolved.length === WORD_PUZZLES.length) {
          setTimeout(() => {
            onSuccess();
          }, 500);
        } else {
          setCurrentPuzzleIndex(currentPuzzleIndex + 1);
          setLetters(shuffleLetters(WORD_PUZZLES[currentPuzzleIndex + 1].word));
          setCurrentGuess('');
        }
      }, 2000);
    } else {
      setError(SHAME_MESSAGES[Math.floor(Math.random() * SHAME_MESSAGES.length)]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 p-4 relative">
      {/* Success Message Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <style>{`
            @keyframes scaleUp {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              50% {
                opacity: 1;
              }
              2% {
                transform: scale(2) rotate(360deg);
                opacity: 0;
              }
            }
            .success-popup {
              animation: scaleUp 2s ease-out forwards;
            }
          `}</style>
          <div className="success-popup text-5xl font-extrabold text-pink-500 bg-white px-12 py-8 rounded-3xl shadow-2xl border-4 border-pink-400">
            {successMessage}
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-2xl text-center">
        <h1 className="text-5xl font-extrabold text-pink-700 mb-2 tracking-tight">A little puzzle 😜</h1>
        <p className="text-gray-500 mb-2 text-sm font-semibold">Solve {currentPuzzleIndex + 1} of {WORD_PUZZLES.length}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPuzzleIndex + solved.length) / WORD_PUZZLES.length) * 100}%` }}
          ></div>
        </div>

        {/* Hint */}
        <p className="text-lg text-gray-700 mb-8 italic font-medium"> {currentHint}</p>

        {/* Answer Display */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-2xl mb-8 border-2 border-pink-200">
          <p className="text-gray-600 text-sm mb-3 font-semibold">Your Answer:</p>
          <div className="flex justify-center gap-3 flex-wrap min-h-16">
            {currentGuess ? (
              currentGuess.split('').map((letter, index) => (
                <div
                  key={index}
                  onClick={() => handleGuessLetterClick(index)}
                  className="w-16 h-16 bg-white border-3 border-pink-400 text-pink-700 text-3xl font-bold rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-pink-100 hover:scale-105 shadow-md"
                >
                  {letter}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center w-full py-4">Click letters below to build your answer</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 font-bold rounded-lg text-lg animate-bounce">
            {error}
          </div>
        )}

        {/* Available Letters */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-4 rounded-2xl mb-8 border-2 border-pink-300">
          <p className="text-gray-700 text-sm mb-4 font-semibold">Available Letters:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-3 max-h-[200px] overflow-y-auto md:max-h-[250px] md:overflow-y-hidden">
            {letters.map((letter) => (
              <button
                key={letter.id}
                onClick={() => handleLetterClick(letter.id)}
                disabled={letter.used}
                className={`w-14 h-14 text-2xl font-bold rounded-xl transition-all duration-200 shadow-md  ${
                  letter.used
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-white text-pink-700 border-2 border-pink-400 cursor-pointer hover:bg-pink-50 hover:scale-110 active:scale-95'
                }`}
              >
                {letter.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClear}
            disabled={!currentGuess}
            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg transition-all hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={currentGuess.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-lg transition-all hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;
