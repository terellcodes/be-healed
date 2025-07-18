import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (openaiKey: string, tavilyKey: string) => void;
  openaiKey: string;
  tavilyKey: string;
}

export default function Settings({ isOpen, onClose, onSaveKeys, openaiKey, tavilyKey }: SettingsProps) {
  const [openaiApiKey, setOpenaiApiKey] = useState(openaiKey);
  const [tavilyApiKey, setTavilyApiKey] = useState(tavilyKey);

  const handleSave = () => {
    onSaveKeys(openaiApiKey, tavilyApiKey);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed left-0 top-0 h-full bg-[#1A1B1E] text-white w-80 transform transition-transform duration-300 ease-in-out border-r border-[#2D3139] z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Settings</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">OpenAI API Key</label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                className="w-full bg-[#2D3139] rounded px-3 py-2 text-sm border border-[#363B44] focus:outline-none focus:border-gray-500"
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Tavily API Key</label>
              <input
                type="password"
                value={tavilyApiKey}
                onChange={(e) => setTavilyApiKey(e.target.value)}
                className="w-full bg-[#2D3139] rounded px-3 py-2 text-sm border border-[#363B44] focus:outline-none focus:border-gray-500"
                placeholder="tvly-..."
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-[#2D3139] text-white rounded px-3 py-2 text-sm hover:bg-[#363B44] transition-colors border border-[#363B44]"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 