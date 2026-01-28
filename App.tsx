import React, { useState, useCallback, useEffect } from 'react';
import { generateQuestions, analyzePersonality } from './services/geminiService';
import { storageService } from './services/storageService';
import { Question, UserAnswer, PersonalityResult, AppState, Option, User, SavedResult } from './types';
import { QuestionCard } from './components/QuestionCard';
import { ResultsView } from './components/ResultsView';
import { ProgressBar } from './components/ProgressBar';
import { Button } from './components/Button';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthForms } from './components/AuthForms';
import { Dashboard } from './components/Dashboard';
import { Sparkles, Brain, GraduationCap, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [user, setUser] = useState<User | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [historyResult, setHistoryResult] = useState<SavedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialization: Check for logged in user
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setAppState(AppState.DASHBOARD);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setAppState(AppState.INTRO);
    setResult(null);
    setHistoryResult(null);
  };

  const startQuiz = useCallback(async () => {
    setAppState(AppState.LOADING_QUESTIONS);
    setError(null);
    setResult(null);
    setHistoryResult(null);
    try {
      const generatedQuestions = await generateQuestions();
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setAppState(AppState.QUIZ);
    } catch (err) {
      console.error(err);
      setError("Failed to generate the quiz. Please check your connection or API key.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleAnswer = useCallback(async (option: Option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      selectedOptionText: option.text,
      selectedTrait: option.trait
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question with a slight delay for better UX
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 200);
    } else {
      // Finish quiz
      setAppState(AppState.ANALYZING);
      try {
        const analysis = await analyzePersonality(updatedAnswers);
        
        // Auto-save if logged in
        if (user) {
          storageService.saveResult(user.id, analysis);
        }
        
        setResult(analysis);
        setAppState(AppState.RESULTS);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze results. Please try again.");
        setAppState(AppState.ERROR);
      }
    }
  }, [currentQuestionIndex, questions, userAnswers, user]);

  const handleRetake = () => {
    setResult(null);
    setHistoryResult(null);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    // If logged in, go to dashboard logic, otherwise intro
    if (user) {
      setAppState(AppState.DASHBOARD);
    } else {
      setAppState(AppState.INTRO);
    }
  };

  const handleViewHistoryResult = (savedResult: SavedResult) => {
    setHistoryResult(savedResult);
    setAppState(AppState.RESULTS);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setAppState(user ? AppState.DASHBOARD : AppState.INTRO)}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">MindSpark</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <span className="text-sm font-medium text-gray-600 hidden sm:block">Hello, {user.name}</span>
                 {appState !== AppState.DASHBOARD && (
                    <Button variant="outline" size="sm" onClick={() => setAppState(AppState.DASHBOARD)}>
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Button>
                 )}
                 <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50">
                   <LogOut className="w-4 h-4 mr-2" /> Logout
                 </Button>
              </>
            ) : (
              appState !== AppState.LOGIN && appState !== AppState.SIGNUP && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setAppState(AppState.LOGIN)}>
                    <LogIn className="w-4 h-4 mr-2" /> Login
                  </Button>
                  <Button size="sm" onClick={() => setAppState(AppState.SIGNUP)} className="hidden sm:inline-flex">
                    <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* Intro Screen (Guest) */}
        {appState === AppState.INTRO && (
          <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-60"></div>
               <GraduationCap className="h-24 w-24 text-gray-900 relative z-10 mx-auto" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 pb-2">
              Unlock Your Potential
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover your unique learning style, hidden academic strengths, and ideal career paths with our AI-powered assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button onClick={startQuiz} size="lg" className="group">
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Start Guest Assessment
              </Button>
            </div>
            
            <div className="pt-8 text-sm text-gray-500">
              <button onClick={() => setAppState(AppState.SIGNUP)} className="text-indigo-600 hover:underline">Create an account</button> to save your history.
            </div>
            
            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: "AI Generated", desc: "Every test is unique, powered by Gemini." },
                { title: "Deep Analysis", desc: "Go beyond simple labels with detailed insights." },
                { title: "Career Guidance", desc: "Find paths that match your cognitive style." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auth Screens */}
        {appState === AppState.LOGIN && (
          <AuthForms 
            mode="LOGIN" 
            onSuccess={handleLoginSuccess} 
            onSwitchMode={() => setAppState(AppState.SIGNUP)} 
          />
        )}
        {appState === AppState.SIGNUP && (
          <AuthForms 
            mode="SIGNUP" 
            onSuccess={handleLoginSuccess} 
            onSwitchMode={() => setAppState(AppState.LOGIN)} 
          />
        )}

        {/* Dashboard (Logged In) */}
        {appState === AppState.DASHBOARD && user && (
          <Dashboard 
            user={user} 
            onStartNew={startQuiz} 
            onViewResult={handleViewHistoryResult}
          />
        )}

        {/* Loading Screens */}
        {(appState === AppState.LOADING_QUESTIONS) && (
          <LoadingScreen mode="questions" />
        )}

        {(appState === AppState.ANALYZING) && (
          <LoadingScreen mode="analysis" />
        )}

        {/* Quiz Screen */}
        {appState === AppState.QUIZ && questions.length > 0 && (
          <div className="w-full max-w-3xl">
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            <QuestionCard 
              question={questions[currentQuestionIndex]} 
              onSelectOption={handleAnswer} 
            />
          </div>
        )}

        {/* Results Screen */}
        {appState === AppState.RESULTS && (result || historyResult) && (
          <ResultsView 
            result={historyResult || result!} 
            onRetake={handleRetake}
            onBackToDashboard={user ? () => setAppState(AppState.DASHBOARD) : undefined}
            isHistoryView={!!historyResult}
          />
        )}

        {/* Error Screen */}
        {appState === AppState.ERROR && (
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg">
            <div className="text-red-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-6">{error || "An unexpected error occurred."}</p>
            <Button onClick={handleRetake}>Try Again</Button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MindSpark. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
