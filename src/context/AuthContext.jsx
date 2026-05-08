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

// Helper: getDoc with a timeout so the app never hangs
function getDocWithTimeout(docRef, timeoutMs = 5000) {
  return Promise.race([
    getDoc(docRef),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), timeoutMs)
    )
  ]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          let mergedData = null;
          try {
            const userDoc = await getDocWithTimeout(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              mergedData = { id: firebaseUser.uid, ...userDoc.data() };
            }
          } catch (firestoreError) {
            console.warn('Firestore read failed during listener, using Google profile as fallback:', firestoreError.message);
          }

          if (!mergedData) {
            mergedData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              isAdvisor: false,
              chapterId: 1,
              uploadCount: 0,
              status: 'pending',
              role: 'student'
            };
          }


          setUser(mergedData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth listener error:', error);
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
      
      let userData = null;

      try {
        const userDoc = await getDocWithTimeout(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          // First time — create profile
          const newUserData = {
            name: userCredential.user.displayName || 'Google User',
            email: userCredential.user.email,
            chapterId: metadata?.chapterId || 1,
            isAdvisor: metadata?.isAdvisor || false,
            schoolName: metadata?.schoolName || null,
            region: metadata?.region || null,
            state: metadata?.state || null,
            chapterKey: metadata?.generatedKey || metadata?.chapterKey || null,
            createdAt: new Date().toISOString(),
            uploadCount: 0,
            status: (metadata && metadata.isAdvisor) ? 'active' : 'pending',
            role: 'student'
          };
          await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
          userData = { id: userCredential.user.uid, ...newUserData };
        } else {
          userData = { id: userCredential.user.uid, ...userDoc.data() };
          
          // Upgrade profile if they are registering as an advisor now
          if (metadata && metadata.isAdvisor && !userData.isAdvisor) {
            const updates = {
              isAdvisor: true,
              chapterId: metadata.chapterId || userData.chapterId,
              schoolName: metadata.schoolName || userData.schoolName,
              region: metadata.region || userData.region,
              state: metadata.state || userData.state,
              chapterKey: metadata.generatedKey || userData.chapterKey,
            };
            await setDoc(doc(db, 'users', userCredential.user.uid), updates, { merge: true });
            userData = { ...userData, ...updates };
          }
        }
      } catch (firestoreError) {
        console.warn('Firestore failed during login, using Google profile:', firestoreError.message);
        
        let fallbackData = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'Google User',
          email: userCredential.user.email,
          chapterId: metadata?.chapterId || 1,
          isAdvisor: metadata?.isAdvisor || false,
          uploadCount: 0,
          status: (metadata && metadata.isAdvisor) ? 'active' : 'pending',
          role: 'student'
        };


        userData = fallbackData;
      }
      
      // Cache locally to survive DB rule blocks
      try {
        localStorage.setItem(`fbla_user_${userCredential.user.uid}`, JSON.stringify(userData));
      } catch(e) {}
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Google Login Error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  };

  const chapter = user ? {
    id: user.chapterId || 1,
    name: user.schoolName || 'Your FBLA Chapter',
    region: user.region || 'Region',
    state: user.state || 'State',
    masterKey: user.chapterKey || 'UNKNOWN-KEY'
  } : null;

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--atlas-bg)] px-4 text-[var(--atlas-fg)]">
        <div className="w-full max-w-sm space-y-4 text-center" role="status" aria-live="polite" aria-busy="true">
          <div className="mx-auto h-12 w-12 rounded-lg border border-[var(--atlas-accent)]/50 bg-[rgba(61,109,118,0.12)]" />
          <div className="space-y-2">
            <div className="skeleton mx-auto h-3 w-40" />
            <div className="skeleton mx-auto h-3 w-28" />
          </div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--atlas-muted)]">
            Loading Atlas
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      chapter,
      isAuthenticated,
      loginWithGoogle,
      logout,
      loading
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
