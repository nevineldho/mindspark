import React from 'react';
import { Question, Option } from '../types';
import { Button } from './Button';

interface QuestionCardProps {
  question: Question;
  onSelectOption: (option: Option) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSelectOption }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-2xl w-full mx-auto transform transition-all animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
        {question.text}
      </h2>
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option)}
            className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group flex items-center"
          >
            <div className="h-6 w-6 rounded-full border-2 border-gray-300 group-hover:border-indigo-600 mr-4 flex-shrink-0 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg text-gray-700 group-hover:text-indigo-900 font-medium">
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};