import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleClear = () => {
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1 bg-[#2D3139] text-white rounded px-4 py-3 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleClear}
        className="px-4 py-2 bg-[#2D3139] text-white rounded hover:bg-[#363B44] transition-colors"
      >
        Clear
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-[#2D3139] text-white rounded hover:bg-[#363B44] transition-colors"
      >
        Send
      </button>
    </form>
  );
} 