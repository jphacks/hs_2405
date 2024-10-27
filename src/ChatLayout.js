// ChatLayout.js
import React from 'react';
import ChatSidebar from './ChatSidebar';
import Chat from './Chat';
import { useParams } from 'react-router-dom';
import './styles/ChatLayout.css';

function ChatLayout({ userId }) {
  const { chatId } = useParams();

  return (
    <div className="chat-layout">
      <ChatSidebar userId={userId} />
      <Chat userId={userId} chatId={chatId} />
    </div>
  );
}

export default ChatLayout;