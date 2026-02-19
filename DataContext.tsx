import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { Idea, Comment, Course, Quote, Suggestion, User, Message, Bookmark } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  ideas: Idea[];
  comments: Comment[];
  courses: Course[];
  quotes: Quote[];
  suggestions: Suggestion[];
  users: User[];
  messages: Message[];
  bookmarks: Bookmark[];
  loadingData: boolean;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!currentUser) {
        setIdeas([]);
        setComments([]);
        setCourses([]);
        setQuotes([]);
        setSuggestions([]);
        setUsers([]);
        setMessages([]);
        setBookmarks([]);
        setLoadingData(false);
        return;
    }

    // Limit initial ideas load to improve performance (last 500)
    // For a real high-scale app, we would use cursor-based pagination
    const qIdeas = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'), limit(500));
    const unsubIdeas = onSnapshot(qIdeas, (snap) => {
      setIdeas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea)));
    });

    const qComments = query(collection(db, 'comments'), orderBy('createdAt', 'desc'), limit(500));
    const unsubComments = onSnapshot(qComments, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });

    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
        setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    });

    const unsubQuotes = onSnapshot(collection(db, 'quotes'), (snap) => {
        setQuotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote)));
    });
    
    const unsubSuggestions = onSnapshot(collection(db, 'suggestions'), (snap) => {
        setSuggestions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Suggestion)));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });

    const unsubMessages = onSnapshot(collection(db, 'messages'), (snap) => {
        setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    // Listen to bookmarks for current user
    const qBookmarks = query(collection(db, 'bookmarks'), where('userId', '==', currentUser.id));
    const unsubBookmarks = onSnapshot(qBookmarks, (snap) => {
        setBookmarks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bookmark)));
    });

    setLoadingData(false);

    return () => {
      unsubIdeas();
      unsubComments();
      unsubCourses();
      unsubQuotes();
      unsubSuggestions();
      unsubUsers();
      unsubMessages();
      unsubBookmarks();
    };
  }, [currentUser]);

  return (
    <DataContext.Provider value={{ ideas, comments, courses, quotes, suggestions, users, messages, bookmarks, loadingData }}>
      {children}
    </DataContext.Provider>
  );
};