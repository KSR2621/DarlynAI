"use client";

import React from 'react';
import type { ChatSession } from '@/hooks/use-chat-history';
import EmptyChat from './empty-chat';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';

type ChatAreaProps = {
  activeChat: ChatSession | undefined;
  isLoading: boolean;
  onSendMessage: (content: string, imageUrl?: string) => void;
  mobileMenuButton: React.ReactNode;
};

export default function ChatArea({ activeChat, isLoading, onSendMessage, mobileMenuButton }: ChatAreaProps) {
  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col">
      {activeChat ? (
        <>
          <header className="flex items-center p-4 border-b">
            {mobileMenuButton}
            <h1 className="text-lg font-semibold ml-2 font-headline">{activeChat.title}</h1>
          </header>
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={activeChat.messages} isLoading={isLoading} />
          </div>
          <div className="p-4 bg-background/95 backdrop-blur-sm">
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
          </div>
        </>
      ) : (
        <EmptyChat mobileMenuButton={mobileMenuButton} />
      )}
    </div>
  );
}
