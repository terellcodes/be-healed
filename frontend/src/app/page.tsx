'use client';

import { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm processing your request...",
        isAI: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="bg-[#1e1e1e] border-b border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PDF RAG IDE</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-400 hover:text-white"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="container mx-auto max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isAI={message.isAI}
              timestamp={message.timestamp}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>

      <footer className="fixed bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        Built with Next.js, Tailwind CSS, Framer Motion, and FastAPI — IDE Inspired
      </footer>
    </div>
  );
}
