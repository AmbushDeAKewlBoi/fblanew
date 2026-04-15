import { createContext, useContext, useState } from 'react';
import { CURRENT_USER, CHAPTERS } from '../data/mockUsers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Mock login — always succeeds with current user
    setUser(CURRENT_USER);
    setIsAuthenticated(true);
    return { success: true, user: CURRENT_USER };
  };

  const loginAsStudent = () => {
    const studentUser = {
      id: 2,
      name: "Sarah Mitchell",
      email: "smitchell@indy.lcps.org",
      chapterId: 1,
      isAdvisor: false,
    };
    setUser(studentUser);
    setIsAuthenticated(true);
    return { success: true, user: studentUser };
  };

  const signup = (userData) => {
    setUser({ ...CURRENT_USER, ...userData });
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const chapter = user ? CHAPTERS.find(c => c.id === user.chapterId) : null;

  return (
    <AuthContext.Provider value={{
      user,
      chapter,
      isAuthenticated,
      login,
      loginAsStudent,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
