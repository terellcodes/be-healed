'use client';

import { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { api } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
  isLoading?: boolean;
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI research assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingId,
      content: "I'm processing your request...",
      isAI: true,
      timestamp: new Date().toISOString(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Call research graph API with system prompt
      const response = await api.query(content, systemPrompt);
      
      // Replace loading message with response
      setMessages((prev) => prev.map(msg => 
        msg.id === loadingId 
          ? {
              id: loadingId,
              content: response.answer,
              isAI: true,
              timestamp: new Date().toISOString(),
              isLoading: false,
            }
          : msg
      ));
    } catch (error) {
      // Replace loading message with error
      setMessages((prev) => prev.map(msg => 
        msg.id === loadingId 
          ? {
              id: loadingId,
              content: "Sorry, I encountered an error while processing your request. Please try again.",
              isAI: true,
              timestamp: new Date().toISOString(),
              isLoading: false,
            }
          : msg
      ));
      console.error('Error querying research graph:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="bg-[#1e1e1e] border-b border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Be Healed Research Assistant</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-400 hover:text-white"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        systemPrompt={systemPrompt}
        onSystemPromptChange={setSystemPrompt}
      />

      <main className="container mx-auto max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isAI={message.isAI}
              timestamp={message.timestamp}
              isLoading={message.isLoading}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>

      <footer className="fixed bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        Built with Next.js, Tailwind CSS, FastAPI, and LangChain
      </footer>
    </div>
  );
}
