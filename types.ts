export interface Option {
  id: string;
  text: string;
  trait: string; // Used for internal scoring heuristic passed to AI
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface UserAnswer {
  questionId: number;
  questionText: string;
  selectedOptionText: string;
  selectedTrait: string;
}

export interface TraitScore {
  trait: string;
  score: number;
  fullMark: number;
}

export interface PersonalityResult {
  archetype: string;
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  studyTips: string[];
  careerPaths: string[];
  traits: TraitScore[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedResult extends PersonalityResult {
  id: string;
  date: string; // ISO string
}

export enum AppState {
  INTRO = 'INTRO',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD',
  LOADING_QUESTIONS = 'LOADING_QUESTIONS',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
