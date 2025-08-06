"use client";

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ArrowUp, Code, Compass, Lightbulb, Send } from 'lucide-react';
import type { UserProfile } from '@/hooks/use-user-profile';

const suggestionCards = [
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Plan a trip",
      description: "to see the Northern Lights in Norway",
      prompt: "Plan a trip to see the Northern Lights in Norway"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Brainstorm ideas",
      description: "for a new fantasy novel",
      prompt: "Brainstorm ideas for a new fantasy novel"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Write a Python script",
      description: "to automate daily reports",
      prompt: "Write a Python script to automate daily reports"
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: "Draft an email",
      description: "to a client about a project update",
      prompt: "Draft an email to a client about a project update"
    },
]

export default function EmptyChat({ onSendMessage, userProfile }: { onSendMessage: (content: string) => void, userProfile: UserProfile }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="text-left w-full mb-12">
            <h1 className="text-5xl md:text-6xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-600">
                Hello {userProfile.name || 'there'}
            </h1>
            <p className="mt-2 text-2xl md:text-3xl text-muted-foreground">
                How can I help you today?
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {suggestionCards.map((card) => (
                <Card key={card.title} className="p-4 flex items-start gap-4 hover:bg-secondary cursor-pointer" onClick={() => onSendMessage(card.prompt)}>
                    <div className="p-2 bg-secondary rounded-full">
                        {card.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                    <ArrowUp className="w-5 h-5 ml-auto text-muted-foreground" />
                </Card>
            ))}
        </div>
    </div>
  );
}
