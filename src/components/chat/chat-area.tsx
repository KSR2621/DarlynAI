"use client";

import React from 'react';
import type { ChatSession } from '@/hooks/use-chat-history';
import EmptyChat from './empty-chat';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'lucide-react';
import type { UserProfile } from '@/hooks/use-user-profile';
import Image from 'next/image';

export default function ChatArea({ activeChat, isLoading, onSendMessage, mobileMenuButton, userProfile }: {
  activeChat: ChatSession | undefined;
  isLoading: boolean;
  onSendMessage: (content: string, imageUrl?: string) => void;
  mobileMenuButton: React.ReactNode;
  userProfile: UserProfile;
}) {

  return (
    <div className="relative flex h-full flex-1 flex-col">
       <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            {mobileMenuButton}
            <h1 className="text-lg font-semibold font-headline">{activeChat ? activeChat.title : "DarlynAI"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className='h-8 w-8'>
             {userProfile.photoDataUri ? (
                <AvatarImage src={userProfile.photoDataUri} alt={userProfile.name} />
              ) : (
                <AvatarFallback>{userProfile.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              )}
          </Avatar>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full">
              {activeChat ? (
                <ChatMessages messages={activeChat.messages} isLoading={isLoading} userProfile={userProfile} />
              ) : (
                <EmptyChat onSendMessage={onSendMessage} userProfile={userProfile} />
              )}
          </div>
      </main>
      <footer className="p-4 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
            <p className="text-xs text-center text-muted-foreground mt-2">
                DarlynAI may display inaccurate info, including about people, so double-check its responses.
            </p>
        </div>
      </footer>
    </div>
  );
}
