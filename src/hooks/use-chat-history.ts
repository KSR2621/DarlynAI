"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, Message } from '@/types';

const CHAT_HISTORY_KEY = 'darlynAiChatHistory';

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedHistory) {
        setSessions(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
      }
    }
  }, [sessions, isLoaded]);

  const addSession = useCallback(() => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prevSessions => [newSession, ...prevSessions]);
    return newSession;
  }, []);

  const updateSession = useCallback((updatedSession: ChatSession) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prevSessions =>
      prevSessions.filter(session => session.id !== sessionId)
    );
  }, []);

  const addMessageToSession = useCallback((sessionId: string, message: Message) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    );
  }, []);
  
  return { sessions, addSession, updateSession, deleteSession, addMessageToSession, isLoaded };
}

export type { ChatSession, Message };
