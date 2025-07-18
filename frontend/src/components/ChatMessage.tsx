import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: string;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isAI, timestamp, isLoading }: ChatMessageProps) {
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className={`py-6 ${isAI ? 'bg-[#1E2128]' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#2D3139]`}>
            {isAI ? '🤖' : '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {isAI ? 'AI Assistant' : 'You'}
              </span>
              <span className="text-xs text-gray-400">{formattedTime}</span>
            </div>
            <div className={`text-sm text-gray-200 ${isLoading ? 'animate-pulse' : ''}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code
                        className={`${
                          inline 
                            ? 'bg-[#2D3139] px-1 py-0.5 rounded' 
                            : 'block bg-[#2D3139] p-4 rounded my-2'
                        } ${className || ''}`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
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
                  }
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 