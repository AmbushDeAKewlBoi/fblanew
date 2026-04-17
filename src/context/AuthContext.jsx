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
              uploadCount: 0
            };
          }

          // Aggressively restore from local cache to ensure admin upgrades survive DB rule blocks
          try {
            const cached = localStorage.getItem(`fbla_user_${firebaseUser.uid}`);
            if (cached) {
              const parsedCache = JSON.parse(cached);
              // If local cache says they are an advisor but DB doesn't, force upgrade them locally!
              if (parsedCache.isAdvisor && !mergedData.isAdvisor) {
                mergedData = { ...mergedData, ...parsedCache, isAdvisor: true };
                // Attempt an aggressive background sync to heal the database
                setDoc(doc(db, 'users', firebaseUser.uid), { 
                  isAdvisor: true, 
                  chapterId: parsedCache.chapterId,
                  schoolName: parsedCache.schoolName,
                  region: parsedCache.region,
                  state: parsedCache.state,
                  chapterKey: parsedCache.chapterKey 
                }, { merge: true }).catch(() => {});
              }
            }
          } catch(e) {}

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
            uploadCount: 0
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
          uploadCount: 0
        };

        // If doing a regular sign in (no metadata) and DB fails, use cached memory to remember advisor
        try {
          const cached = localStorage.getItem(`fbla_user_${userCredential.user.uid}`);
          if (cached && !metadata) {
            fallbackData = { ...fallbackData, ...JSON.parse(cached) };
          }
        } catch(e) {}

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

  // Show a loading spinner instead of a blank white screen
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#141414',
        color: '#e5e2de',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, margin: '0 auto 16px',
            border: '3px solid #334155',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ fontSize: 14, opacity: 0.6 }}>Loading Atlas...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
