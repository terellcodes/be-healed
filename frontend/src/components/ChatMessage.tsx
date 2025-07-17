interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: string;
}

export default function ChatMessage({ message, isAI, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-4 p-4 ${isAI ? 'bg-[#1e1e1e]' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAI ? 'bg-green-600' : 'bg-blue-600'
      }`}>
        {isAI ? '🤖' : '👤'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{isAI ? 'AI Assistant' : 'You'}</span>
          <span className="text-xs text-gray-400">{timestamp}</span>
        </div>
        <p className="text-sm text-gray-200 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
} 