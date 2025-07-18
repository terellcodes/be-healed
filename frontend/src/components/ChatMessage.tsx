import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: string;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isAI, timestamp, isLoading }: ChatMessageProps) {
  // Format timestamp consistently
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

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
          <span suppressHydrationWarning className="text-xs text-gray-400">{formattedTime}</span>
        </div>
        <div className={`text-sm text-gray-200 ${isLoading ? 'animate-pulse' : ''}`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Style code blocks
              code({ node, inline, className, children, ...props }) {
                return (
                  <code
                    className={`${inline ? 'bg-gray-800 px-1 py-0.5 rounded' : 'block bg-gray-800 p-4 rounded-lg my-2'} ${className || ''}`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Style links
              a({ node, children, ...props }) {
                return (
                  <a
                    className="text-blue-400 hover:text-blue-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              // Style paragraphs
              p({ node, children, ...props }) {
                return (
                  <p className="mb-4 last:mb-0" {...props}>
                    {children}
                  </p>
                );
              }
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 