"use client";

import React, { useState } from 'react';
import {
  SidebarHeader,
  SidebarContent as SidebarBody,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Trash2, Check, X, HelpCircle, History, Settings, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/chat/theme-toggle';
import type { ChatSession } from '@/hooks/use-chat-history';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(session.title);

  const handleRename = () => {
    onRename(title);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setTitle(session.title);
      setIsRenaming(false);
    }
  };

  return (
    <SidebarMenuItem>
      {isRenaming ? (
        <div className="flex w-full items-center gap-1 rounded-md p-1.5 bg-background">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-7 flex-1"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRename}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsRenaming(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <SidebarMenuButton
          onClick={onSelect}
          isActive={isActive}
          className="group/button"
          tooltip={session.title}
        >
          <MessageSquare />
          <span className="flex-1">{session.title}</span>
          <div className="opacity-0 group-hover/button:opacity-100 group-data-[active=true]:opacity-100 transition-opacity flex items-center">
            <SidebarMenuAction
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              aria-label="Rename chat"
              className="relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-pen-line"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M8 18h1"/><path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z"/></svg>
            </SidebarMenuAction>
            <SidebarMenuAction
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete chat"
              className="relative"
            >
              <Trash2 />
            </SidebarMenuAction>
          </div>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

export default function SidebarContent({
  sessions,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}: any) {
  const { isMobile, state } = useSidebar();
  
  return (
    <div className="flex flex-col h-full">
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
            <SidebarTrigger className='w-8 h-8 md:block hidden'/>
            <h2 className={`font-semibold text-lg ${state === 'collapsed' && 'hidden'}`}>DarlynAI</h2>
           </div>
           <Button variant="ghost" className={`${state === 'collapsed' && 'hidden'}`} size="sm" onClick={onNewChat}>
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
        </div>
      </SidebarHeader>
      
      <SidebarBody className="flex-1">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <p className={`text-sm text-muted-foreground px-4 py-2 ${state === 'collapsed' && 'hidden'}`}>Recent</p>
            <SidebarMenu>
              {sessions.map((session:any) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={activeChatId === session.id}
                  onSelect={() => onSelectChat(session.id)}
                  onDelete={() => onDeleteChat(session.id)}
                  onRename={(newTitle) => onRenameChat(session.id, newTitle)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarBody>
      
      <SidebarFooter className='mt-auto'>
        <SidebarMenu>
            <SidebarMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SidebarMenuButton tooltip="Help">
                      <HelpCircle />
                      <span>Help</span>
                  </SidebarMenuButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Help</AlertDialogTitle>
                    <AlertDialogDescription>
                      This is an AI-powered chat application. You can ask questions, get explanations, and generate content.
                      <h3 className="font-bold mt-4 mb-2">Keyboard Shortcuts</h3>
                      <ul className="list-disc list-inside text-sm">
                        <li><kbd className="font-mono bg-muted p-1 rounded-md">Ctrl/Cmd + B</kbd> - Toggle sidebar</li>
                        <li><kbd className="font-mono bg-muted p-1 rounded-md">Enter</kbd> - Send message</li>
                        <li><kbd className="font-mono bg-muted p-1 rounded-md">Shift + Enter</kbd> - New line</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Got it</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuButton tooltip="Activity">
                      <History />
                      <span>Activity</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Activity</DialogTitle>
                    <DialogDescription>
                      Review and manage your past conversations.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                    {sessions.length > 0 ? sessions.map((session: ChatSession) => (
                      <div key={session.id} className="p-3 rounded-lg border bg-card hover:bg-secondary cursor-pointer" onClick={() => onSelectChat(session.id)}>
                        <h3 className="font-semibold text-sm truncate">{session.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {session.messages.length} message{session.messages.length === 1 ? '' : 's'}
                          {' - '}
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground py-16">
                        <History className="mx-auto h-12 w-12" />
                        <p className="mt-4">No activity yet</p>
                        <p className="text-sm">Your chat history will appear here.</p>
                      </div>
                    )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Manage your application settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="theme" className="text-sm font-medium">Theme</label>
                      <ThemeToggle />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className='p-2'>
          <SidebarMenuButton tooltip="User Profile">
            <Avatar className='h-6 w-6'>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span>User</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </div>
  );
}
