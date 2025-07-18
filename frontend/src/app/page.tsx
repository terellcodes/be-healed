'use client';

import { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Settings from '@/components/Settings';
import { api } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
  isLoading?: boolean;
}

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI research assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSaveKeys = (openaiKey: string, tavilyKey: string) => {
    setOpenaiKey(openaiKey);
    setTavilyKey(tavilyKey);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

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
      const response = await api.query(content, openaiKey, tavilyKey);
      
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
    <div className="min-h-screen bg-[#1A1B1E] text-white">
      <header className="bg-[#1A1B1E] px-4 py-2 border-b border-[#2D3139] flex justify-between items-center">
        <h1 className="text-lg font-medium">Be Healed Research Assistant</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#2D3139] rounded"
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      </header>

      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveKeys={handleSaveKeys}
        openaiKey={openaiKey}
        tavilyKey={tavilyKey}
      />

      <main className="flex flex-col h-[calc(100vh-48px)]">
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

        <div className="p-4 bg-[#1A1B1E]">
          <ChatInput onSendMessage={handleSendMessage} />
          <div className="mt-2 text-xs text-center text-gray-500">
            Built with Next.js, TailwindCSS, FastAPI, and LangChain
          </div>
        </div>
      </main>
    </div>
  );
}
