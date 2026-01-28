import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  mode: 'questions' | 'analysis';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ mode }) => {
  const [message, setMessage] = useState('');
  
  const questionMessages = [
    "Consulting the archives of psychology...",
    "Designing questions just for you...",
    "Preparing your assessment...",
  ];

  const analysisMessages = [
    "Analyzing your neural pathways...",
    "Comparing results with student archetypes...",
    "Synthesizing your career potential...",
    "Finalizing your personalized report...",
  ];

  const messages = mode === 'questions' ? questionMessages : analysisMessages;

  useEffect(() => {
    let index = 0;
    setMessage(messages[0]);
    
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="bg-white p-6 rounded-2xl shadow-xl relative z-10">
           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{message}</h3>
      <p className="text-gray-500">Powered by Gemini AI</p>
    </div>
  );
};