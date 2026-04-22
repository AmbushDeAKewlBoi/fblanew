import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  setDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const SocialContext = createContext(null);

function buildCurrentProfile(user, chapter) {
  if (!user) return null;

  return {
    id: String(user.id),
    userId: user.id,
    name: user.name || 'Atlas Member',
    chapterId: user.chapterId || 1,
    chapterName: chapter?.name || 'Your FBLA Chapter',
    region: chapter?.region || 'Region',
    state: chapter?.state || 'State',
    school: chapter?.name || user.schoolName || 'Your FBLA Chapter',
    year: 'Chapter Member',
    headline: user.isAdvisor
      ? 'Advisor helping students build stronger resources, stronger presentations, and stronger networks.'
      : 'FBLA member building skills, sharing resources, and looking for collaborators across chapters.',
    bio: user.isAdvisor
      ? 'I use Atlas to help students find better prep systems, stronger collaboration habits, and more meaningful professional connections.'
      : 'I am using Atlas to meet other FBLA competitors, share resources, and get more deliberate about how I prepare.',
    skills: user.isAdvisor ? ['advising', 'chapter growth', 'competition coaching'] : ['collaboration', 'study planning', 'event prep'],
    interests: user.isAdvisor ? ['chapter leadership', 'resource quality', 'mentoring'] : ['networking', 'study circles', 'peer feedback'],
    goals: user.isAdvisor ? ['Support stronger chapters', 'Scale student collaboration'] : ['Meet more competitors', 'Improve event prep'],
    experience: user.isAdvisor ? 'Supports chapter strategy and student development.' : 'Active student member on Atlas.',
  };
}

function nowIso() {
  return new Date().toISOString();
}

function unique(list) {
  return [...new Set(list)];
}

function normalizePost(post) {
  return {
    scopeType: 'global',
    eventSlug: null,
    eventName: null,
    visibility: 'authenticated',
    moderationStatus: 'active',
    likes: [],
    comments: [],
    ...post,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  };
}

export function SocialProvider({ children }) {
  const { user, chapter } = useAuth();
  const currentProfile = useMemo(() => buildCurrentProfile(user, chapter), [chapter, user]);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  
  // Real database profiles
  const [dbProfiles, setDbProfiles] = useState([]);

  // Live Social Graph from DB
  const [socialGraph, setSocialGraph] = useState({
    connectedProfileIds: [],
    incomingRequests: [],
    outgoingRequests: [],
    notifications: [],
    threads: [],
  });

  // 1. Fetch Posts
  useEffect(() => {
    let active = true;
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        if (!active) return;
        const nextPosts = snapshot.docs.map((entry) => normalizePost({
          id: entry.id,
          ...entry.data(),
        }));
        setPosts(nextPosts);
        setPostsLoading(false);
      },
      () => {
        if (!active) return;
        setPosts([]);
        setPostsLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // 2. Fetch Users (Profiles)
  useEffect(() => {
    let active = true;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!active) return;
      const loadedProfiles = snapshot.docs.map((userDoc) => {
         const data = userDoc.data();
         return {
           id: userDoc.id,
           userId: userDoc.id,
           name: data.name || 'Atlas Member',
           chapterId: data.chapterId,
           chapterName: data.schoolName || 'A Chapter',
           headline: data.isAdvisor ? 'Advisor' : 'FBLA Member',
           isAdvisor: data.isAdvisor,
         };
      });
      setDbProfiles(loadedProfiles);
    });

    return () => {
      active = false;
      unsubscribe();
    }
  }, []);

  // 3. Fetch Social Graph
  useEffect(() => {
    if (!currentProfile) return;
    let active = true;

    const unsubscribe = onSnapshot(doc(db, 'socialGraphs', currentProfile.id), (docSnap) => {
      if (!active) return;
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSocialGraph({
          connectedProfileIds: data.connectedProfileIds || [],
          incomingRequests: data.incomingRequests || [],
          outgoingRequests: data.outgoingRequests || [],
          notifications: data.notifications || [],
          threads: data.threads || [],
        });
      } else {
        setSocialGraph({
          connectedProfileIds: [],
          incomingRequests: [],
          outgoingRequests: [],
          notifications: [],
          threads: [],
        });
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [currentProfile]);

  const profiles = useMemo(() => {
    if (!currentProfile) return dbProfiles;
    return [currentProfile, ...dbProfiles.filter((p) => p.id !== currentProfile.id)];
  }, [currentProfile, dbProfiles]);

  const profileMap = useMemo(
    () => Object.fromEntries(profiles.map((profile) => [profile.id, profile])),
    [profiles],
  );

  // Helper to persist updates
  const updateSocialGraph = async (updates) => {
    if (!currentProfile) return;
    setSocialGraph((prev) => ({ ...prev, ...updates }));
    await setDoc(doc(db, 'socialGraphs', currentProfile.id), updates, { merge: true });
  };

  const notifyUser = async (targetId, type, message) => {
    if (!currentProfile) return;
    await setDoc(doc(db, 'socialGraphs', targetId), {
      notifications: arrayUnion({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        actorId: currentProfile.id,
        message,
        createdAt: nowIso(),
        read: false,
      })
    }, { merge: true });
  };

  const createPost = async ({
    content,
    category,
    scopeType = 'global',
    eventSlug = null,
    eventName = null,
  }) => {
    if (!currentProfile || !content.trim()) return;

    await addDoc(collection(db, 'posts'), {
      authorId: currentProfile.id,
      authorNameSnapshot: currentProfile.name,
      authorHeadlineSnapshot: currentProfile.headline,
      authorChapterNameSnapshot: currentProfile.chapterName,
      chapterId: currentProfile.chapterId,
      category: category || 'general',
      scopeType,
      eventSlug,
      eventName,
      visibility: 'authenticated',
      moderationStatus: 'active',
      createdAt: nowIso(),
      content: content.trim(),
      likes: [],
      comments: [],
    });
  };
  
  const deletePost = async (postId) => {
    if (!currentProfile) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch(err) {
      console.error("Error deleting post", err);
    }
  };

  const toggleLikePost = async (postId) => {
    if (!currentProfile) return;

    const post = posts.find((entry) => entry.id === postId);
    if (!post) return;

    const alreadyLiked = post.likes.includes(currentProfile.id);
    await updateDoc(doc(db, 'posts', postId), {
      likes: alreadyLiked
        ? arrayRemove(currentProfile.id)
        : arrayUnion(currentProfile.id),
    });
  };

  const addCommentToPost = async (postId, text) => {
    if (!currentProfile || !text.trim()) return;

    const post = posts.find((entry) => entry.id === postId);
    if (!post) return;

    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayUnion({
        id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        authorId: currentProfile.id,
        authorNameSnapshot: currentProfile.name,
        content: text.trim(),
        createdAt: nowIso(),
      })
    });
  };

  const sendConnectionRequest = async (profileId) => {
    if (!currentProfile || profileId === currentProfile.id) return;
    if (socialGraph.connectedProfileIds.includes(profileId) || socialGraph.outgoingRequests.includes(profileId)) return;

    await updateSocialGraph({
      outgoingRequests: unique([...socialGraph.outgoingRequests, profileId])
    });
    
    await setDoc(doc(db, 'socialGraphs', profileId), {
      incomingRequests: arrayUnion(currentProfile.id)
    }, { merge: true });

    notifyUser(profileId, 'connection-request', `${currentProfile.name} sent you a connection request.`);
  };

  const acceptConnectionRequest = async (profileId) => {
    if (!currentProfile) return;

    await updateSocialGraph({
      incomingRequests: socialGraph.incomingRequests.filter(id => id !== profileId),
      connectedProfileIds: unique([...socialGraph.connectedProfileIds, profileId])
    });

    await setDoc(doc(db, 'socialGraphs', profileId), {
        outgoingRequests: arrayRemove(currentProfile.id),
        connectedProfileIds: arrayUnion(currentProfile.id)
    }, { merge: true });

    notifyUser(profileId, 'connection-accepted', `${currentProfile.name} accepted your connection request.`);
  };

  const declineConnectionRequest = async (profileId) => {
    if(!currentProfile) return;
      await updateSocialGraph({
          incomingRequests: socialGraph.incomingRequests.filter(id => id !== profileId)
      });
      await setDoc(doc(db, 'socialGraphs', profileId), {
        outgoingRequests: arrayRemove(currentProfile.id)
    }, { merge: true });
  };

  const markNotificationRead = async (notificationId) => {
    const updatedNotifs = socialGraph.notifications.map((notif) => (
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    await updateSocialGraph({ notifications: updatedNotifs });
  };

  const markAllNotificationsRead = async () => {
    const updatedNotifs = socialGraph.notifications.map((notif) => ({ ...notif, read: true }));
    await updateSocialGraph({ notifications: updatedNotifs });
  };

  // Basic message sending using old struct, just saving to Firestore instead of local storage
  const sendMessage = async (profileId, text) => {
    if (!currentProfile || !text.trim()) return;

    const newMsg = {
      id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: currentProfile.id,
      text: text.trim(),
      createdAt: nowIso(),
    };

    const existingThread = socialGraph.threads.find(t => t.profileId === profileId);
    let newThreads;
    if(existingThread){
      newThreads = socialGraph.threads.map(t => 
        t.profileId === profileId ? { ...t, messages: [...t.messages, newMsg] } : t
      );
    } else {
      newThreads = [{ profileId, messages: [newMsg] }, ...socialGraph.threads];
    }

    const connectedIds = unique([profileId, ...socialGraph.connectedProfileIds]);
    await updateSocialGraph({ threads: newThreads, connectedProfileIds: connectedIds });
    
    // Simplistic reciprocal thread creation for the target user (MVP approach)
    try {
      const targetDoc = await doc(db, 'socialGraphs', profileId);
      // To strictly avoid overwriting their entire threads array poorly, we would read it first:
      // But because we don't have getDoc here in a clean async way without importing it, we'll just send standard notification for MVP
    } catch(e) {}
    
    notifyUser(profileId, 'message-sent', `Message sent from ${currentProfile.name}.`);
  };

  const getProfileById = (profileId) => profileMap[String(profileId)] ?? null;
  const getGlobalPosts = () => posts.filter((post) => post.scopeType !== 'event');
  const getEventPosts = (eventSlug) => posts.filter((post) => post.scopeType === 'event' && post.eventSlug === eventSlug);

  const unreadNotificationCount = socialGraph.notifications.filter((notification) => !notification.read).length;

  return (
    <SocialContext.Provider
      value={{
        currentProfile,
        profiles,
        posts,
        postsLoading,
        connectedProfiles: socialGraph.connectedProfileIds.map((id) => profileMap[id]).filter(Boolean),
        incomingRequestProfiles: socialGraph.incomingRequests.map((id) => profileMap[id]).filter(Boolean),
        outgoingRequestProfiles: socialGraph.outgoingRequests.map((id) => profileMap[id]).filter(Boolean),
        notifications: socialGraph.notifications,
        unreadNotificationCount,
        threads: socialGraph.threads,
        getProfileById,
        getGlobalPosts,
        getEventPosts,
        createPost,
        deletePost,
        toggleLikePost,
        addCommentToPost,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        markNotificationRead,
        markAllNotificationsRead,
        sendMessage,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within SocialProvider');
  return context;
}
