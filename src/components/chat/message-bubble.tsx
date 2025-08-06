"use client";

import React from 'react';
import type { Message } from '@/hooks/use-chat-history';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { GeminiIcon } from '@/components/icons';
import Image from 'next/image';
import { CodeBlock } from './code-block';
import { Card, CardContent } from '../ui/card';

// A simple markdown renderer
const MarkdownContent = ({ content }: { content: string }) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const codeBlock = part.replace(/```/g, '');
                    const language = codeBlock.match(/^(.*?)\n/)?.[1] || '';
                    const code = codeBlock.replace(/^(.*?)\n/, '');
                    return <CodeBlock key={index} language={language} value={code} />;
                }
                
                // Simple markdown for bold and lists
                const htmlContent = part
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .split('\n')
                    .map((line, i) => {
                        if (line.trim().startsWith('- ')) {
                            return `<li key=${i}>${line.substring(2)}</li>`;
                        }
                        if (line.trim().startsWith('* ')) {
                            return `<li key=${i}>${line.substring(2)}</li>`;
                        }
                        return line;
                    })
                    .join('<br />')
                    .replace(/<li/g, '<ul class="list-disc pl-5"><li')
                    .replace(/<\/li><br \/>(<ul|<li)/g, '</li>$1')
                    .replace(/<br \/>\s*<ul>/g, '<ul>')
                    .replace(/<\/li>(?!<li)/g, '</li></ul>');

                return <div key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
            })}
        </div>
    );
};

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const avatar = isUser ? (
    <Avatar className="h-8 w-8">
      <AvatarFallback><User size={20} /></AvatarFallback>
    </Avatar>
  ) : (
    <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
      <GeminiIcon className="w-6 h-6 text-white" />
    </Avatar>
  );

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && avatar}
      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`rounded-2xl ${isUser ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none'}`}>
          <CardContent className="p-3">
            {message.imageUrl && (
              <div className="mb-2">
                <Image
                  src={message.imageUrl}
                  alt="User upload"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {message.content && <MarkdownContent content={message.content} />}
          </CardContent>
        </Card>
      </div>
      {isUser && avatar}
    </div>
  );
}
