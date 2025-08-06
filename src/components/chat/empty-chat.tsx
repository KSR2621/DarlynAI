"use client";

import React from 'react';
import { GeminiIcon } from '@/components/icons';

type EmptyChatProps = {
    mobileMenuButton: React.ReactNode;
}

export default function EmptyChat({ mobileMenuButton }: EmptyChatProps) {
  return (
    <div className="flex flex-col h-full">
        <header className="flex items-center p-4 border-b md:hidden">
            {mobileMenuButton}
        </header>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
            <div className="text-center">
                <GeminiIcon className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-4xl font-bold font-headline text-gray-800 dark:text-gray-200">
                    Hello, how can I help?
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Start a new chat from the sidebar to begin.
                </p>
            </div>
        </div>
    </div>
  );
}
