import React, { useState } from 'react';
import { PersonalityResult } from '../types';
import { Button } from './Button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Share2, RefreshCw, BookOpen, Briefcase, Zap, AlertCircle, X, Copy, Check, Facebook, Linkedin, Twitter, LayoutDashboard } from 'lucide-react';

interface ResultsViewProps {
  result: PersonalityResult;
  onRetake?: () => void;
  onBackToDashboard?: () => void;
  isHistoryView?: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ 
  result, 
  onRetake, 
  onBackToDashboard,
  isHistoryView = false 
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareText, setShareText] = useState(
    `I just discovered my student archetype is "${result.archetype}" on MindSpark! 🎓\n\n"${result.tagline}"\n\nFind out your learning style here:`
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${shareText} ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const url = window.location.href;
    const text = shareText;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        // Facebook prioritizes the URL, but we pass quote for contexts that support it
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=500,scrollbars=yes');
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in relative">
      {/* Navigation for History View */}
      {isHistoryView && onBackToDashboard && (
        <div className="mb-6">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-indigo-600 p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Your Student Archetype</h2>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">{result.archetype}</h1>
          <p className="text-xl md:text-2xl font-light italic opacity-90">"{result.tagline}"</p>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
               <h3 className="text-2xl font-bold text-gray-800 mb-4">Who you are</h3>
               <p className="text-gray-600 text-lg leading-relaxed mb-6">
                 {result.description}
               </p>
               <div className="flex flex-wrap gap-4">
                 {!isHistoryView && onRetake && (
                   <Button variant="outline" onClick={onRetake} size="sm">
                     <RefreshCw className="w-4 h-4 mr-2" /> Retake Test
                   </Button>
                 )}
                 {onBackToDashboard && !isHistoryView && (
                    <Button variant="outline" onClick={onBackToDashboard} size="sm">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Button>
                 )}
                 <Button variant="secondary" size="sm" onClick={() => setIsShareModalOpen(true)}>
                   <Share2 className="w-4 h-4 mr-2" /> Share Result
                 </Button>
               </div>
            </div>
            
            <div className="w-full md:w-1/2 h-[300px] bg-gray-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.traits}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="trait" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Key Strengths</h3>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-400">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Growth Areas</h3>
          </div>
          <ul className="space-y-3">
            {result.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Study Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-indigo-500">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Study Strategy</h3>
          </div>
          <ul className="space-y-3">
            {result.studyTips.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Career Paths */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-teal-500">
           <div className="flex items-center mb-6">
            <div className="bg-teal-100 p-3 rounded-full mr-4">
              <Briefcase className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Career Matches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.careerPaths.map((item, idx) => (
              <span key={idx} className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-medium text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsShareModalOpen(false)}
          />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 p-6 md:p-8 animate-fade-in-up">
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <Share2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Share Results</h3>
              <p className="text-gray-500">Show off your archetype to the world!</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  value={shareText}
                  onChange={(e) => setShareText(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all min-h-[100px] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleSocialShare('twitter')}
                  className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all font-medium"
                >
                  <Twitter className="w-4 h-4" /> Twitter / X
                </button>
                <button 
                  onClick={() => handleSocialShare('facebook')}
                  className="flex items-center justify-center gap-2 bg-[#1877F2] text-white p-3 rounded-xl hover:opacity-90 transition-all font-medium"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button 
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex items-center justify-center gap-2 bg-[#0A66C2] text-white p-3 rounded-xl hover:opacity-90 transition-all font-medium"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 p-3 rounded-xl hover:bg-gray-200 transition-all font-medium border-2 border-transparent hover:border-gray-300"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
