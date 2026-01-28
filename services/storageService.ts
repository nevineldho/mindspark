import { User, PersonalityResult, SavedResult } from "../types";

const USERS_KEY = 'mindspark_users';
const RESULTS_KEY = 'mindspark_results';
const SESSION_KEY = 'mindspark_session';

export const storageService = {
  // Auth Methods
  signup: (name: string, email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login
    const userSession = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
    
    return userSession;
  },

  login: (email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const userSession = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
    return userSession;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // Data Methods
  saveResult: (userId: string, result: PersonalityResult): SavedResult => {
    const allResults = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
    const userResults = allResults[userId] || [];
    
    const savedResult: SavedResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };

    userResults.unshift(savedResult); // Add to beginning
    allResults[userId] = userResults;
    localStorage.setItem(RESULTS_KEY, JSON.stringify(allResults));
    
    return savedResult;
  },

  getHistory: (userId: string): SavedResult[] => {
    const allResults = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
    return allResults[userId] || [];
  }
};
