'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !db) return;

    setLoading(true);
    setError(null);

    try {
      // Create a query to get messages where the user is either sender or receiver
      const messagesQuery = query(
        collection(db, 'messages'),
        where('participants', 'array-contains', user.uid),
        orderBy('createdAt', 'desc')
      );

      // Set up a real-time listener
      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messageList: Message[] = [];
          let unread = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            const message = {
              id: doc.id,
              ...data,
              createdAt: data.createdAt as Timestamp,
            } as Message;

            messageList.push(message);

            // Count unread messages where the user is the receiver
            if (!message.read && message.receiverId === user.uid) {
              unread++;
            }
          });

          setMessages(messageList);
          setUnreadCount(unread);
          setLoading(false);
        },
        (err) => {
          console.error('Error getting messages:', err);
          setError('Failed to load messages. Please try again later.');
          setLoading(false);
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up messages listener:', err);
      setError(err.message || 'Failed to load messages');
      setLoading(false);
    }
  }, [user]);

  return { messages, loading, error, unreadCount };
}
