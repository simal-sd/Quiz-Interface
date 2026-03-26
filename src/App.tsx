import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Zap, ShieldCheck, MapPin, Recycle, Trophy, Play, Leaf } from 'lucide-react';
import { quizData } from './data/quizData';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    const q = query(collection(db, 'quiz_entries_v2'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: any[] = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setLeaderboard(entries);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'quiz_entries_v2');
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
      saveScore(score);
    }
  };

  const saveScore = async (finalScore: number) => {
    if (saved) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'quiz_entries_v2'), {
        userName: userName || 'Anonymous',
        score: finalScore,
        totalQuestions: quizData.length,
        timestamp: serverTimestamp()
      });
      setSaved(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'quiz_entries_v2');
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 p-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-lg shadow-emerald-200"
          >
            <Recycle size={48} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">E-Waste Quiz</h1>
          <p className="text-slate-600 mb-8 text-lg">Test your knowledge on electronic waste and see how you stack up against others!</p>
          
          <div className="mb-8 text-left">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Enter your name (optional)</label>
            <input 
              type="text" 
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Anonymous"
              className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-lg"
          >
            <Play size={24} className="fill-current" />
            Start Challenge
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Progress percentage
  const progress = ((currentQuestion) / quizData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-white p-4 md:p-6 border-b border-slate-100 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Recycle size={24} className="text-emerald-600" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">E-Waste Quiz</h1>
          </div>
          <div className="flex items-center gap-4">
            {!showScore && (
              <div className="hidden md:flex items-center gap-2 text-sm font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-full">
                <span className="text-emerald-600">{currentQuestion + 1}</span> 
                <span className="text-slate-400">/</span> 
                <span>{quizData.length}</span>
              </div>
            )}
            <button onClick={resetQuiz} className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100">
              Quit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!showScore && (
          <div className="w-full bg-slate-100 h-2 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        )}

        <div className="p-4 md:p-8 flex-1 bg-slate-50/50">
          {showScore ? (
            /* Results Screen */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-xl shadow-emerald-200"
              >
                <Trophy size={48} className="text-white" />
              </motion.div>
              <h2 className="text-4xl font-extrabold mb-3 text-slate-800">Quiz Complete, {userName}!</h2>
              <p className="text-xl text-slate-600 mb-8">
                You scored <span className="font-black text-emerald-600 text-3xl mx-1">{score}</span> out of {quizData.length}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-slate-800">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    Quick Recap
                  </h3>
                  <ul className="space-y-4 text-slate-600 text-sm md:text-base">
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full mt-0.5"><CheckCircle2 size={16} className="text-emerald-600 shrink-0" /></div>
                      <span>Bring anything with a plug, cord, or battery.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full mt-0.5"><CheckCircle2 size={16} className="text-emerald-600 shrink-0" /></div>
                      <span>Keep batteries dry, cool, and tape the terminals if loose.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full mt-0.5"><CheckCircle2 size={16} className="text-emerald-600 shrink-0" /></div>
                      <span>Drop off at our well-lit, central common area bins (like the main lobby and cafeteria)!</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full mt-0.5"><CheckCircle2 size={16} className="text-emerald-600 shrink-0" /></div>
                      <span>Wipe your data before dropping off phones/laptops.</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100/50 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Trophy size={100} className="text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-emerald-800 relative z-10">
                    <Trophy className="text-emerald-600" size={24} />
                    Leaderboard
                  </h3>
                  <div className="space-y-3 relative z-10">
                    {leaderboard.length === 0 ? (
                      <p className="text-sm text-emerald-700/70 italic">No entries yet. Be the first!</p>
                    ) : (
                      leaderboard.map((entry, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + (idx * 0.05) }}
                          key={entry.id} 
                          className={cn(
                            "flex justify-between items-center text-sm md:text-base bg-white p-3 rounded-xl shadow-sm border border-emerald-100/50",
                            idx === 0 && "ring-2 ring-emerald-400 bg-emerald-50/50",
                            idx === 1 && "ring-1 ring-emerald-300/50",
                            idx === 2 && "ring-1 ring-emerald-200/50"
                          )}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className={cn(
                              "font-black w-6 text-center",
                              idx === 0 ? "text-yellow-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-amber-600" : "text-slate-300"
                            )}>
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-700 truncate">
                              {entry.userName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-100/50 px-2 py-1 rounded-lg shrink-0">
                            <span className="font-bold text-emerald-700">{entry.score}</span>
                            <span className="text-emerald-600/60 text-xs font-bold">/ {entry.totalQuestions}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetQuiz}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg text-lg"
              >
                <RotateCcw size={20} />
                Play Again
              </motion.button>
            </motion.div>
          ) : (
            /* Quiz Question */
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="mb-6 rounded-2xl overflow-hidden shadow-md border border-slate-200 h-48 md:h-64 relative bg-slate-100 group">
                  <img 
                    src={quizData[currentQuestion].image} 
                    alt="Question contextual visual" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-md">
                      {quizData[currentQuestion].question}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {quizData[currentQuestion].options.map((option, index) => {
                    
                    let buttonClass = "w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden ";
                    
                    if (!isAnswered) {
                      buttonClass += "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-white hover:shadow-md";
                    } else if (option.isCorrect) {
                      buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-500/20";
                    } else if (selectedOption === index) {
                      buttonClass += "border-red-400 bg-red-50 text-red-900 shadow-sm";
                    } else {
                      buttonClass += "border-slate-200 bg-white opacity-40";
                    }

                    return (
                      <motion.button
                        whileHover={!isAnswered ? { scale: 1.01, y: -2 } : {}}
                        whileTap={!isAnswered ? { scale: 0.99 } : {}}
                        key={index}
                        onClick={() => handleAnswerClick(option.isCorrect, index)}
                        disabled={isAnswered}
                        className={buttonClass}
                      >
                        <span className="font-semibold text-base md:text-lg relative z-10 pr-6">{option.text}</span>
                        {isAnswered && option.isCorrect && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 z-10">
                            <CheckCircle2 className="text-emerald-500 fill-emerald-100 w-6 h-6 md:w-8 md:h-8" />
                          </motion.div>
                        )}
                        {isAnswered && selectedOption === index && !option.isCorrect && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 z-10">
                            <XCircle className="text-red-500 fill-red-100 w-6 h-6 md:w-8 md:h-8" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation & Next Button */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      className="p-5 md:p-6 bg-white border-2 border-slate-100 shadow-lg rounded-2xl overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            {quizData[currentQuestion].options[selectedOption].isCorrect ? 
                              <span className="text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-lg"><CheckCircle2 size={20}/> Spot on!</span> : 
                              <span className="text-red-600 flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg"><XCircle size={20}/> Not quite!</span>
                            }
                          </h4>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {quizData[currentQuestion].explanation}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center justify-center md:justify-end mt-4 md:mt-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNextQuestion}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md"
                          >
                            {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next'}
                            <ArrowRight size={20} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
