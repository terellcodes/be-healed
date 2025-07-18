import { XMarkIcon } from '@heroicons/react/24/outline';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
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
                className="w-full bg-[#2D3139] rounded px-3 py-2 text-sm border border-[#363B44] focus:outline-none focus:border-gray-500"
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Model</label>
              <select className="w-full bg-[#2D3139] rounded px-3 py-2 text-sm border border-[#363B44] focus:outline-none focus:border-gray-500">
                <option>GPT-4.1 Mini</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">System Prompt</label>
              <textarea
                className="w-full bg-[#2D3139] rounded px-3 py-2 text-sm border border-[#363B44] focus:outline-none focus:border-gray-500 h-32 resize-none"
                placeholder="Enter system prompt..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload PDF</label>
              <button className="w-full bg-[#2D3139] text-white rounded px-3 py-2 text-sm hover:bg-[#363B44] transition-colors border border-[#363B44]">
                Upload PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 