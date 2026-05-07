import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { supabase, STORAGE_BUCKET } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export function useResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};
    
    // Safety timeout — if Firestore doesn't respond in 8 seconds, stop waiting
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    try {
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        clearTimeout(timeout);
        if (!mounted) return;
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Do not fallback to mock data if data array is empty; return the empty array from DB.
        setResources(data);
        setLoading(false);
      }, (error) => {
        clearTimeout(timeout);
        console.error("Error fetching resources:", error);
        if (!mounted) return;
        setResources([]);
        setLoading(false);
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error setting up resources listener:", error);
      import('../data/mockResources').then(({ RESOURCES }) => {
        if (!mounted) return;
        setResources(RESOURCES);
        setLoading(false);
      });
    }

    return () => {
      mounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const deleteResource = async (id, storagePath) => {
    try {
      const resourceToDel = resources.find(r => r.id === id);
      if (!resourceToDel) throw new Error("Resource not found");
      
      if (resourceToDel.uploaderId !== user?.id && !user?.isAdvisor) {
        throw new Error("Unauthorized: You do not have permission to delete this resource.");
      }

      if (storagePath) {
        const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        if (error) {
          console.error("Error deleting from Supabase storage:", error);
        }
      }
      await deleteDoc(doc(db, 'resources', id));
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  };

  return { resources, loading, deleteResource };
}
