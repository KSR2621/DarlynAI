
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

export default function ChatArea({ activeChat, isLoading, onSendMessage, userProfile }: {
  activeChat: ChatSession | undefined;
  isLoading: boolean;
  onSendMessage: (content: string, imageUrl?: string) => void;
  userProfile: UserProfile;
}) {

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto">
          <div className="h-full max-w-4xl mx-auto px-4">
              {activeChat ? (
                <ChatMessages messages={activeChat.messages} isLoading={isLoading} userProfile={userProfile} />
              ) : (
                <EmptyChat onSendMessage={onSendMessage} userProfile={userProfile} />
              )}
          </div>
      </main>
      <footer className="p-4 bg-background/95 backdrop-blur-sm shrink-0 border-t">
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
