import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CHAPTERS } from '../data/mockUsers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() });
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
         return { success: false, error: "Cloud profile not found." };
      }

      const fullUser = { id: userCredential.user.uid, ...userDoc.data() };
      setUser(fullUser);
      setIsAuthenticated(true);
      return { success: true, user: fullUser };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      let userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // If it's their very first time logging in with Google, we need to build their profile
      if (!userDoc.exists()) {
        const newUserData = {
          name: userCredential.user.displayName || "Google User",
          email: userCredential.user.email,
          chapterId: 1, // Default to a standard chapter id (e.g. 1) for demo/MVP
          isAdvisor: false,
          createdAt: new Date().toISOString(),
          uploadCount: 0
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
        userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      }
      
      const fullUser = { id: userCredential.user.uid, ...userDoc.data() };
      setUser(fullUser);
      setIsAuthenticated(true);
      return { success: true, user: fullUser };
    } catch (error) {
      console.error("Google Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const loginAsStudent = async () => {
    // Legacy fallback mock login removal warning
    console.warn("loginAsStudent is disabled. Please create a real account.");
    return { success: false, error: "Demo mode disabled. Please create a real account." };
  };

  const signup = async (userData) => {
    try {
      // 1. Create Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // 2. Remove password before saving to Firestore Database
      const { password, ...safeUserData } = userData;
      const finalUserData = {
        ...safeUserData,
        createdAt: new Date().toISOString(),
        uploadCount: 0
      };

      // 3. Save User Profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), finalUserData);

      setUser({ id: userCredential.user.uid, ...finalUserData });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Signup Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
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
      loginWithGoogle,
      loginAsStudent,
      signup,
      logout,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
