"use client";

import React, { useEffect, useRef } from 'react';
import type { Message } from '@/hooks/use-chat-history';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './message-bubble';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserProfile } from '@/hooks/use-user-profile';

type TypingIndicatorProps = {
  className?: string;
};

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        className="h-2.5 w-2.5 bg-primary rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="h-2.5 w-2.5 bg-primary rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-2.5 w-2.5 bg-primary rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
      />
    </div>
  );
};

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  userProfile: UserProfile;
};

export default function ChatMessages({ messages, isLoading, userProfile }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full" viewportRef={viewportRef}>
      <div className="p-4 space-y-6" ref={scrollAreaRef}>
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <MessageBubble message={message} userProfile={userProfile} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-secondary">
                  <TypingIndicator />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
}
