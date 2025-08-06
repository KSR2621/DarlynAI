"use client";

import React from 'react';
import type { ChatSession } from '@/hooks/use-chat-history';
import EmptyChat from './empty-chat';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User } from 'lucide-react';

export default function ChatArea({ activeChat, isLoading, onSendMessage, mobileMenuButton }: {
  activeChat: ChatSession | undefined;
  isLoading: boolean;
  onSendMessage: (content: string, imageUrl?: string) => void;
  mobileMenuButton: React.ReactNode;
}) {

  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col">
       <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            {mobileMenuButton}
            <h1 className="text-lg font-semibold font-headline">{activeChat ? activeChat.title : "DarlynAI"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className='h-8 w-8'>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {activeChat ? (
          <ChatMessages messages={activeChat.messages} isLoading={isLoading} />
        ) : (
          <EmptyChat onSendMessage={onSendMessage} />
        )}
      </div>
      <div className="p-4 bg-background/95 backdrop-blur-sm">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        <p className="text-xs text-center text-muted-foreground mt-2">
            DarlynAI may display inaccurate info, including about people, so double-check its responses.
        </p>
      </div>
    </div>
  );
}
