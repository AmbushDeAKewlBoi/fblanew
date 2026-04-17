import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { RESOURCES } from '../data/mockResources';

export function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    
    // Safety timeout — if Firestore doesn't respond in 8 seconds, stop waiting
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    try {
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        clearTimeout(timeout);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResources(data.length > 0 ? data : RESOURCES);
        setLoading(false);
      }, (error) => {
        clearTimeout(timeout);
        console.error("Error fetching resources:", error);
        setResources(RESOURCES);
        setLoading(false);
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error setting up resources listener:", error);
      setResources(RESOURCES);
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { resources, loading };
}
