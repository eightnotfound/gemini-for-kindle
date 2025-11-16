import React, { useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = React.useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      // Set height based on scroll height, respecting the min-height from CSS
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-300">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}
          className="flex-grow p-4 text-lg font-sans bg-gray-100 text-black border border-gray-400 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-70 min-h-16"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="h-16 w-16 flex items-center justify-center bg-black text-white rounded-3xl disabled:bg-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 flex-shrink-0"
          aria-label="Send message"
        >
          <SendIcon className="w-7 h-7" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;