import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates from Firestore 'resources' collection
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching resources: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { resources, loading };
}
