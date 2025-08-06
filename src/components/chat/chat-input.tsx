"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizontal, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type ChatInputProps = {
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading: boolean;
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if ((!message.trim() && !imagePreview) || isLoading) return;
    onSendMessage(message, imagePreview || undefined);
    setMessage('');
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="relative">
      {imagePreview && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-secondary rounded-lg shadow-md">
            <div className="relative">
                <Image src={imagePreview} alt="Image preview" width={80} height={80} className="rounded-md" />
                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background" onClick={() => setImagePreview(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
      )}
      <div className="flex items-end gap-2 p-2 rounded-lg border bg-card text-card-foreground shadow-sm">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
          <Paperclip />
          <span className="sr-only">Attach image</span>
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none max-h-48"
          rows={1}
          disabled={isLoading}
        />
        <Button size="icon" onClick={handleSend} disabled={isLoading || (!message.trim() && !imagePreview)}>
          <SendHorizontal />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
