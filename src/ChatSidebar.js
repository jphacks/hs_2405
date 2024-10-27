import React, { useEffect, useState } from 'react';
import { getOrCreateChat } from './chatService'; 
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './styles/ChatSidebar.css';

async function getUserName(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data().name : '不明';
}

function ChatSidebar({ userId }) {
  const [matches, setMatches] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchQuery = query(collection(db, 'UserMatches'), where('userId', '==', userId));
        const matchSnapshot = await getDocs(matchQuery);

        const matchData = await Promise.all(matchSnapshot.docs.map(async (doc) => {
          const matchInfo = doc.data();
          const matchedUserName = await getUserName(matchInfo.matchedUserId);
          return { matchedUserId: matchInfo.matchedUserId, matchedUserName };
        }));

        setMatches(matchData);
      } catch (error) {
        console.error('マッチングとデータ取得エラー:', error);
      }
    };

    fetchMatches();
  }, [userId]);

  const handleChatClick = async (matchedUserId) => {
    try {
      const chatId = await getOrCreateChat(userId, matchedUserId);
      setSelectedUserId(matchedUserId); // Update selected user ID
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("チャットルームの取得または作成エラー:", error);
    }
  };

  return (
    <div className="chat-sidebar">
      <h2>Chats</h2>
      <ul>
        {matches.map((match) => (
          <li
            key={match.matchedUserId}
            className={match.matchedUserId === selectedUserId ? 'selected' : ''} 
          >
            <button onClick={() => handleChatClick(match.matchedUserId)}>
              <h4>{match.matchedUserName}</h4>
            </button>
          </li>
        ))}
      </ul>
      <div className="osusume">
        <Link to="/dashboard">back to dashboard</Link>
      </div>
    </div>
  );
}

export default ChatSidebar;