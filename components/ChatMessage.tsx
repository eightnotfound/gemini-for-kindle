import React, { useMemo } from 'react';
import { marked } from 'marked';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === 'model';

  const renderedHtml = useMemo(() => {
    if (isUserModel) {
      // Parse markdown to HTML string. GFM and breaks enabled for better formatting.
      return { __html: marked.parse(message.text, { gfm: true, breaks: true }) as string };
    }
    return { __html: '' }; // Not used for user messages
  }, [message.text, isUserModel]);

  return (
    <div className={`w-full flex ${isUserModel ? 'justify-start' : 'justify-end'}`}>
      <div className="max-w-[90%] p-3 mb-4 rounded-lg bg-gray-100 border border-gray-300">
        {isUserModel ? (
          <div
            className="prose-container text-lg text-black font-sans break-words"
            dangerouslySetInnerHTML={renderedHtml}
          />
        ) : (
          <p className="text-lg text-black font-sans whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
