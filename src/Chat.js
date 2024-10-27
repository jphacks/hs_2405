import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc, query, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import './styles/Chat.css';

async function getUserName(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data().name : '不明';
}

function Chat({ userId }) {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserName, setOtherUserName] = useState(''); // 相手の名前
  const messageListRef = useRef(null); // Ref for the message list

  useEffect(() => {
    const fetchOtherUserName = async () => {
      const chatDoc = await getDoc(doc(db, 'Chats', chatId));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const otherUserId = chatData.user1 === userId ? chatData.user2 : chatData.user1;
        const name = await getUserName(otherUserId);
        setOtherUserName(name);
      }
    };

    fetchOtherUserName();
  }, [chatId, userId]);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'Chats', chatId, 'Messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    // Scroll to the bottom of the message list whenever messages change
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'Chats', chatId, 'Messages'), {
        userId,
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior (like form submission)
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>{otherUserName}</h2> {/* Displaying the other user's name */}
      <div className="message-list" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.userId === userId ? 'my-message' : 'other-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Listening for Enter key press
          placeholder="メッセージを入力..."
        />
        <button className="send-button" onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}

export default Chat;