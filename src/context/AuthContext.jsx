import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
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
      try {
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
      } catch (error) {
        console.error("Auth listener error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (metadata = null) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      let userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // First time logging in or passing explicit signup metadata
      if (!userDoc.exists()) {
        const newUserData = {
          name: userCredential.user.displayName || "Google User",
          email: userCredential.user.email,
          chapterId: metadata?.chapterId || 1,
          isAdvisor: metadata?.isAdvisor || false,
          schoolName: metadata?.schoolName || null,
          region: metadata?.region || null,
          state: metadata?.state || null,
          chapterKey: metadata?.generatedKey || null,
          createdAt: new Date().toISOString(),
          uploadCount: 0
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
        userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      } else if (metadata) {
        // If they already exist but tried to "sign up", we could update their profile here if needed
        // For now, we'll just log them in normally.
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
      loginWithGoogle,
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
