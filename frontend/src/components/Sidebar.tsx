import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSystemPromptChange: (prompt: string) => void;
  systemPrompt: string;
}

export default function Sidebar({ isOpen, onClose, onSystemPromptChange, systemPrompt }: SidebarProps) {
  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#1e1e1e] text-white w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">OpenAI API Key</label>
            <input
              type="password"
              className="w-full bg-[#2d2d2d] rounded-md px-3 py-2 text-sm"
              placeholder="sk-..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Model</label>
            <select className="w-full bg-[#2d2d2d] rounded-md px-3 py-2 text-sm">
              <option>GPT-4.1 Mini</option>
              <option>GPT-4</option>
              <option>GPT-3.5</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">System Prompt</label>
            <textarea
              className="w-full bg-[#2d2d2d] rounded-md px-3 py-2 text-sm h-32 resize-none"
              placeholder="Enter system prompt..."
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload PDF</label>
            <button className="w-full bg-[#2d2d2d] text-white rounded-md px-3 py-2 text-sm hover:bg-[#3d3d3d]">
              Upload PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 