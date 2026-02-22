'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ChatMessage } from '@/types';
import { formatTime, isEmoji } from '@/lib/utils';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😊', '👏', '🙏', '💯'];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    setShowEmojis(false);
  };

  const handleEmojiClick = (emoji: string) => {
    onSendMessage(emoji);
    setShowEmojis(false);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold">Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {msg.userName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    msg.isEmoji 
                      ? 'text-2xl' 
                      : 'text-gray-300 break-words'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="p-3 border-t border-gray-700">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 text-xl hover:bg-gray-700 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message or emoji..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2"
              icon={<Smile className="w-4 h-4" />}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!message.trim()}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
