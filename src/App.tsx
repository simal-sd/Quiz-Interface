import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Zap, ShieldCheck, MapPin, Recycle, Trophy, Play } from 'lucide-react';
import { quizData } from './data/quizData';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [userName, setUserName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'quiz_entries'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: any[] = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setLeaderboard(entries);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'quiz_entries');
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (userName.trim() === '') {
      setUserName('Anonymous');
    }
    setQuizStarted(true);
  };

  const handleAnswerClick = (isCorrect: boolean, index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
      saveScore(score + (quizData[currentQuestion].options[selectedOption!]?.isCorrect ? 1 : 0));
    }
  };

  const saveScore = async (finalScore: number) => {
    if (saved) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'quiz_entries'), {
        userName: userName || 'Anonymous',
        score: finalScore,
        totalQuestions: quizData.length,
        timestamp: serverTimestamp()
      });
      setSaved(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'quiz_entries');
    } finally {
      setIsSaving(true); // Keep it true so we don't try to save again
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setSaved(false);
    setIsSaving(false);
    setQuizStarted(false);
    setUserName('');
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-2 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <Recycle size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">E-Waste Quiz</h1>
          <p className="text-slate-600 mb-6">Test your knowledge on electronic waste and see how you stack up against others!</p>
          
          <div className="mb-6 text-left">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Enter your name (optional)</label>
            <input 
              type="text" 
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder=""
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            <Play size={20} />
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Progress percentage
  const progress = ((currentQuestion) / quizData.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-2 font-sans text-slate-800">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-emerald-600 p-3 md:p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Recycle size={32} className="text-emerald-200" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight">E-Waste Quiz</h1>
          </div>
          <div className="flex items-center gap-4">
            {!showScore && (
              <div className="hidden md:block text-sm font-medium bg-emerald-700/50 px-3 py-1.5 rounded-full">
                Question {currentQuestion + 1} of {quizData.length}
              </div>
            )}
            <button onClick={resetQuiz} className="text-sm hover:text-emerald-200 transition-colors">
              Quit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!showScore && (
          <div className="w-full bg-slate-200 h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="p-4 md:p-6">
          {showScore ? (
            /* Results Screen */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Zap size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Quiz Complete, {userName}!</h2>
              <p className="text-lg text-slate-600 mb-4">
                You scored <span className="font-bold text-emerald-600 text-2xl">{score}</span> out of {quizData.length}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4 text-left">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" />
                    Quick Recap:
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Bring anything with a plug, cord, or battery.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Keep batteries dry, cool, and tape the terminals if loose.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Drop off at our well-lit, central common area bin!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Wipe your data before dropping off phones/laptops.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-emerald-800">
                    <Trophy className="text-emerald-600" />
                    Leaderboard
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.length === 0 ? (
                      <p className="text-sm text-emerald-700">No entries yet. Be the first!</p>
                    ) : (
                      leaderboard.map((entry, idx) => (
                        <div key={entry.id} className="flex justify-between items-center text-sm bg-white p-2 rounded shadow-sm">
                          <span className="font-medium text-slate-700 truncate pr-2">
                            {idx + 1}. {entry.userName}
                          </span>
                          <span className="font-bold text-emerald-600 shrink-0">{entry.score} / {entry.totalQuestions}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-8 rounded-xl transition-colors"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
            </div>
          ) : (
            /* Quiz Question */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-semibold mb-3 leading-snug">
                {quizData[currentQuestion].question}
              </h2>
              
              <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-slate-200 h-32 md:h-48 relative bg-slate-100">
                <img 
                  src={quizData[currentQuestion].image} 
                  alt="Question contextual visual" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800";
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quizData[currentQuestion].options.map((option, index) => {
                  
                  let buttonClass = "w-full text-left p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
                  
                  if (!isAnswered) {
                    buttonClass += "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 bg-white";
                  } else if (option.isCorrect) {
                    buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                  } else if (selectedOption === index) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-slate-200 bg-white opacity-50";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(option.isCorrect, index)}
                      disabled={isAnswered}
                      className={buttonClass}
                    >
                      <span className="font-medium">{option.text}</span>
                      {isAnswered && option.isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0 ml-3" />}
                      {isAnswered && selectedOption === index && !option.isCorrect && <XCircle className="text-red-500 shrink-0 ml-3" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {isAnswered && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    {quizData[currentQuestion].options[selectedOption].isCorrect ? 
                      <span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 size={20}/> Spot on!</span> : 
                      <span className="text-red-600 flex items-center gap-2"><XCircle size={20}/> Not quite!</span>
                    }
                  </h4>
                  <p className="text-slate-600 mb-3 leading-relaxed text-sm">
                    {quizData[currentQuestion].explanation}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
                  >
                    {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer hint */}
      <div className="fixed bottom-2 text-center w-full text-slate-400 text-sm pointer-events-none">
        Preparing for the upcoming E-Waste Drive
      </div>
    </div>
  );
}
