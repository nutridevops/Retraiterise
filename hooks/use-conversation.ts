'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useConversation(otherUserId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db || !otherUserId) return;

    setLoading(true);
    setError(null);

    try {
      // Sort the IDs to ensure consistent array order for queries
      const participantsArray = [user.uid, otherUserId].sort();

      // Create a query to get messages between these two users
      const messagesQuery = query(
        collection(db, 'messages'),
        where('participants', '==', participantsArray),
        orderBy('createdAt', 'desc')
      );

      // Set up a real-time listener
      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messageList: Message[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            const message = {
              id: doc.id,
              ...data,
              createdAt: data.createdAt as Timestamp,
            } as Message;

            messageList.push(message);
          });

          setMessages(messageList);
          setLoading(false);
        },
        (err) => {
          console.error('Error getting conversation:', err);
          setError('Failed to load conversation. Please try again later.');
          setLoading(false);
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up conversation listener:', err);
      setError(err.message || 'Failed to load conversation');
      setLoading(false);
    }
  }, [user, otherUserId]);

  return { messages, loading, error };
}
