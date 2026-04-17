import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { SOCIAL_DEFAULTS, SOCIAL_POSTS, SOCIAL_PROFILES } from '../data/mockSocial';

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

function storageKeyForUser(userId) {
  return `atlas_social_${userId}`;
}

function nowIso() {
  return new Date().toISOString();
}

function unique(list) {
  return [...new Set(list)];
}

export function SocialProvider({ children }) {
  const { user, chapter } = useAuth();
  const currentProfile = useMemo(() => buildCurrentProfile(user, chapter), [chapter, user]);

  const [posts, setPosts] = useState(SOCIAL_POSTS);
  const [connectedProfileIds, setConnectedProfileIds] = useState(SOCIAL_DEFAULTS.connectedProfileIds);
  const [incomingRequests, setIncomingRequests] = useState(SOCIAL_DEFAULTS.incomingRequests);
  const [outgoingRequests, setOutgoingRequests] = useState(SOCIAL_DEFAULTS.outgoingRequests);
  const [notifications, setNotifications] = useState(SOCIAL_DEFAULTS.notifications);
  const [threads, setThreads] = useState(SOCIAL_DEFAULTS.threads);

  useEffect(() => {
    if (!currentProfile) return;

    const stored = localStorage.getItem(storageKeyForUser(currentProfile.id));
    if (!stored) {
      setPosts(SOCIAL_POSTS);
      setConnectedProfileIds(SOCIAL_DEFAULTS.connectedProfileIds);
      setIncomingRequests(SOCIAL_DEFAULTS.incomingRequests);
      setOutgoingRequests(SOCIAL_DEFAULTS.outgoingRequests);
      setNotifications(SOCIAL_DEFAULTS.notifications);
      setThreads(SOCIAL_DEFAULTS.threads);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setPosts(parsed.posts ?? SOCIAL_POSTS);
      setConnectedProfileIds(parsed.connectedProfileIds ?? SOCIAL_DEFAULTS.connectedProfileIds);
      setIncomingRequests(parsed.incomingRequests ?? SOCIAL_DEFAULTS.incomingRequests);
      setOutgoingRequests(parsed.outgoingRequests ?? SOCIAL_DEFAULTS.outgoingRequests);
      setNotifications(parsed.notifications ?? SOCIAL_DEFAULTS.notifications);
      setThreads(parsed.threads ?? SOCIAL_DEFAULTS.threads);
    } catch {
      setPosts(SOCIAL_POSTS);
      setConnectedProfileIds(SOCIAL_DEFAULTS.connectedProfileIds);
      setIncomingRequests(SOCIAL_DEFAULTS.incomingRequests);
      setOutgoingRequests(SOCIAL_DEFAULTS.outgoingRequests);
      setNotifications(SOCIAL_DEFAULTS.notifications);
      setThreads(SOCIAL_DEFAULTS.threads);
    }
  }, [currentProfile]);

  useEffect(() => {
    if (!currentProfile) return;

    localStorage.setItem(
      storageKeyForUser(currentProfile.id),
      JSON.stringify({
        posts,
        connectedProfileIds,
        incomingRequests,
        outgoingRequests,
        notifications,
        threads,
      }),
    );
  }, [connectedProfileIds, currentProfile, incomingRequests, notifications, outgoingRequests, posts, threads]);

  const profiles = useMemo(() => {
    if (!currentProfile) return SOCIAL_PROFILES;

    return [currentProfile, ...SOCIAL_PROFILES.filter((profile) => profile.id !== currentProfile.id)];
  }, [currentProfile]);

  const profileMap = useMemo(
    () => Object.fromEntries(profiles.map((profile) => [profile.id, profile])),
    [profiles],
  );

  const addNotification = (type, actorId, message) => {
    setNotifications((current) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        actorId,
        message,
        createdAt: nowIso(),
        read: false,
      },
      ...current,
    ]);
  };

  const createPost = ({ content, category }) => {
    if (!currentProfile || !content.trim()) return;

    setPosts((current) => [
      {
        id: `post-${Date.now()}`,
        authorId: currentProfile.id,
        category: category || 'general',
        createdAt: nowIso(),
        content: content.trim(),
        likes: [],
        comments: [],
      },
      ...current,
    ]);
  };

  const toggleLikePost = (postId) => {
    if (!currentProfile) return;

    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post;

      const alreadyLiked = post.likes.includes(currentProfile.id);
      return {
        ...post,
        likes: alreadyLiked
          ? post.likes.filter((id) => id !== currentProfile.id)
          : [...post.likes, currentProfile.id],
      };
    }));
  };

  const addCommentToPost = (postId, text) => {
    if (!currentProfile || !text.trim()) return;

    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post;

      return {
        ...post,
        comments: [
          ...post.comments,
          {
            id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            authorId: currentProfile.id,
            content: text.trim(),
            createdAt: nowIso(),
          },
        ],
      };
    }));
  };

  const sendConnectionRequest = (profileId) => {
    if (!currentProfile || profileId === currentProfile.id) return;
    if (connectedProfileIds.includes(profileId) || outgoingRequests.includes(profileId)) return;

    setOutgoingRequests((current) => unique([profileId, ...current]));
    addNotification('connection-sent', profileId, `You sent ${profileMap[profileId]?.name || 'this member'} a connection request.`);
  };

  const acceptConnectionRequest = (profileId) => {
    if (!currentProfile) return;

    setIncomingRequests((current) => current.filter((id) => id !== profileId));
    setConnectedProfileIds((current) => unique([profileId, ...current]));
    addNotification('connection-accepted', profileId, `You connected with ${profileMap[profileId]?.name || 'this member'}.`);
  };

  const declineConnectionRequest = (profileId) => {
    setIncomingRequests((current) => current.filter((id) => id !== profileId));
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === notificationId ? { ...notification, read: true } : notification
    )));
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const sendMessage = (profileId, text) => {
    if (!currentProfile || !text.trim()) return;

    setThreads((current) => {
      const existingThread = current.find((thread) => thread.profileId === profileId);

      if (existingThread) {
        return current.map((thread) => (
          thread.profileId === profileId
            ? {
                ...thread,
                messages: [
                  ...thread.messages,
                  {
                    id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    senderId: currentProfile.id,
                    text: text.trim(),
                    createdAt: nowIso(),
                  },
                ],
              }
            : thread
        ));
      }

      return [
        {
          profileId,
          messages: [
            {
              id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              senderId: currentProfile.id,
              text: text.trim(),
              createdAt: nowIso(),
            },
          ],
        },
        ...current,
      ];
    });

    setConnectedProfileIds((current) => unique([profileId, ...current]));
    addNotification('message-sent', profileId, `Message sent to ${profileMap[profileId]?.name || 'this member'}.`);
  };

  const getProfileById = (profileId) => profileMap[String(profileId)] ?? null;

  const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;

  return (
    <SocialContext.Provider
      value={{
        currentProfile,
        profiles,
        posts,
        connectedProfiles: connectedProfileIds.map((id) => profileMap[id]).filter(Boolean),
        incomingRequestProfiles: incomingRequests.map((id) => profileMap[id]).filter(Boolean),
        outgoingRequestProfiles: outgoingRequests.map((id) => profileMap[id]).filter(Boolean),
        notifications,
        unreadNotificationCount,
        threads,
        getProfileById,
        createPost,
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
