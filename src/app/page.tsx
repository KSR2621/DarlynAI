"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
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
      <PanelLeft />
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
    if (!activeChatId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      imageUrl,
      createdAt: Date.now(),
    };
    addMessageToSession(activeChatId, userMessage);
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
        addMessageToSession(activeChatId, aiMessage);
      } else {
        response = await generateAIResponse({ question: content });
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.response,
          createdAt: Date.now(),
        };
        addMessageToSession(activeChatId, aiMessage);
      }
      
      // Auto-generate title for the first message
      if (activeChat && activeChat.messages.length === 1) {
        const firstUserMessage = activeChat.messages[0].content;
        const newTitle = firstUserMessage.split(' ').slice(0, 4).join(' ') + (firstUserMessage.length > 20 ? '...' : '');
        updateSession({ ...activeChat, title: newTitle });
      }

    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem communicating with the AI. Please try again.",
      });
      // Optional: remove the user's message on error, or add an error message to the chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        isError: true,
        createdAt: Date.now()
      }
      addMessageToSession(activeChatId, errorMessage);

    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, addMessageToSession, toast, activeChat, updateSession]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar variant="sidebar" collapsible="offcanvas">
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
