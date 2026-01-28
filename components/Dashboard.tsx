import React, { useEffect, useState } from 'react';
import { SavedResult, User } from '../types';
import { storageService } from '../services/storageService';
import { Button } from './Button';
import { Sparkles, Calendar, ArrowRight, Brain, Clock, Plus } from 'lucide-react';

interface DashboardProps {
  user: User;
  onStartNew: () => void;
  onViewResult: (result: SavedResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartNew, onViewResult }) => {
  const [history, setHistory] = useState<SavedResult[]>([]);

  useEffect(() => {
    setHistory(storageService.getHistory(user.id));
  }, [user.id]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Hero */}
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 relative overflow-hidden border border-indigo-50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-teal-50 rounded-full blur-3xl opacity-60 -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">{user.name}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            Your personal growth journey continues here. Review your past insights or discover how you've evolved with a new assessment.
          </p>
          <Button size="lg" onClick={onStartNew} className="shadow-xl shadow-indigo-200">
            <Plus className="w-5 h-5 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Stats / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Total Assessments</p>
          <p className="text-4xl font-bold mt-1">{history.length}</p>
        </div>
        
        <div className="bg-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-teal-50 text-sm font-medium uppercase tracking-wider">Latest Archetype</p>
          <p className="text-2xl font-bold mt-1 truncate">
            {history.length > 0 ? history[0].archetype : "N/A"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-center items-center text-center">
           <p className="text-gray-500 text-sm mb-2">Ready to explore more?</p>
           <button onClick={onStartNew} className="text-indigo-600 font-semibold hover:underline">
             Take another test &rarr;
           </button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-400" />
          History
        </h2>
        
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-4">You haven't taken any personality tests yet.</p>
            <Button variant="outline" onClick={onStartNew}>Start your first test</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((result) => (
              <div 
                key={result.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-teal-400"></div>
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full flex items-center">
                       <Calendar className="w-3 h-3 mr-1.5" />
                       {new Date(result.date).toLocaleDateString()}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {result.archetype}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    "{result.tagline}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.strengths.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md">
                        {s}
                      </span>
                    ))}
                    {result.strengths.length > 2 && (
                       <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-md">+{result.strengths.length - 2}</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => onViewResult(result)}
                    className="w-full flex items-center justify-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Full Report <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
