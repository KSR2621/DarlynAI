"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import SidebarContent from '@/components/chat/sidebar-content';
import ChatArea from '@/components/chat/chat-area';
import { useChatHistory, type ChatSession, type Message } from '@/hooks/use-chat-history';
import { generateAIResponse } from '@/ai/flows/generate-ai-responses';
import { interpretImages } from '@/ai/flows/interpret-images';
import { useToast } from '@/hooks/use-toast';

function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggleSidebar}
    >
      <Menu />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );
}

export default function OpenGeminiPage() {
  const {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    addMessageToSession,
  } = useChatHistory();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const activeChat = useMemo(
    () => sessions.find((s) => s.id === activeChatId),
    [sessions, activeChatId]
  );

  const handleNewChat = useCallback(() => {
    const newSession = addSession();
    setActiveChatId(newSession.id);
  }, [addSession]);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    deleteSession(id);
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }, [deleteSession, activeChatId]);

  const handleRenameChat = useCallback((id: string, newTitle: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      updateSession({ ...session, title: newTitle });
    }
  }, [sessions, updateSession]);

  const handleSendMessage = useCallback(async (content: string, imageUrl?: string) => {
    let currentChatId = activeChatId;

    if (!currentChatId) {
      const newSession = addSession();
      setActiveChatId(newSession.id);
      currentChatId = newSession.id;
    }

    if (!currentChatId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      imageUrl,
      createdAt: Date.now(),
    };
    addMessageToSession(currentChatId, userMessage);
    setIsLoading(true);

    try {
      let response;
      if (imageUrl) {
        response = await interpretImages({
          photoDataUri: imageUrl,
          question: content,
        });
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.answer,
          createdAt: Date.now(),
        };
        addMessageToSession(currentChatId, aiMessage);
      } else {
        response = await generateAIResponse({ question: content });
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.response,
          createdAt: Date.now(),
        };
        addMessageToSession(currentChatId, aiMessage);
      }
      
      const session = sessions.find(s => s.id === currentChatId);
      if (session && session.messages.length === 1) {
        const firstUserMessage = session.messages[0].content;
        const newTitle = firstUserMessage.split(' ').slice(0, 4).join(' ') + (firstUserMessage.length > 20 ? '...' : '');
        updateSession({ ...session, title: newTitle });
      }

    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem communicating with the AI. Please try again.",
      });
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        isError: true,
        createdAt: Date.now()
      }
      addMessageToSession(currentChatId, errorMessage);

    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, addMessageToSession, toast, sessions, updateSession, addSession]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent
            sessions={sessions}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
            <ChatArea
              activeChat={activeChat}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              mobileMenuButton={<MobileMenuButton />}
            />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
