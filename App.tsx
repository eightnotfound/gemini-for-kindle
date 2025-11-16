import React, { useState, useEffect, useRef } from 'react';
import type { Message } from './types';
import type { Chat } from '@google/genai';
import { startChat } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', role: 'model', text: 'Hello! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatRef.current = startChat();
    } catch (e: any) {
      setError(e.message || "Failed to initialize chat service.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!chatRef.current) {
        setError("Chat is not initialized.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userInput,
    };
    
    // Add user message and a placeholder for the model's response
    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [
        ...prev, 
        userMessage, 
        { id: modelMessageId, role: 'model', text: '...' }
    ]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userInput });
      
      let fullResponse = '';
      let firstChunk = true;

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;

        // If it's the first chunk, replace the placeholder
        if (firstChunk) {
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: chunkText } : msg
            ));
            firstChunk = false;
        } else { // Otherwise, append to the existing message
             setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: fullResponse } : msg
            ));
        }
      }

    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      console.error(e);
      setError(`Error: ${errorMessage}`);
      setMessages(prev => prev.filter(msg => msg.id !== modelMessageId)); // Remove placeholder on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white text-black">
      <header className="p-3 border-b border-gray-300 text-center sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold font-sans">Gemini for Kindle</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
