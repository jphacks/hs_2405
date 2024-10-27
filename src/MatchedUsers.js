import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getOrCreateChat } from './chatService';
import { useNavigate } from 'react-router-dom';
import './styles/MatchedUsers.css';

async function getUserName(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data().name : '不明';
}

function MatchedUsers({ userId }) {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchQuery = query(collection(db, 'UserMatches'), where('userId', '==', userId));
        const matchSnapshot = await getDocs(matchQuery);

        const matchData = await Promise.all(matchSnapshot.docs.map(async (doc) => {
          const matchInfo = doc.data();
          const matchedUserName = await getUserName(matchInfo.matchedUserId);
          return { ...matchInfo, matchedUserName };
        }));

        setMatches(matchData);
      } catch (error) {
        console.error('マッチングとデータ取得エラー:', error);
      }
    };

    fetchMatches();
  }, [userId]);

  const handleStartChat = async (matchedUserId) => {
    try {
      const chatId = await getOrCreateChat(userId, matchedUserId);
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("チャットの開始エラー:", error);
    }
  };

  return (
    <div>
      <h2>マッチしたユーザー</h2>
      <ul>
        {matches.map((match, index) => (
          <li key={index}>
            <p>マッチユーザー名: {match.matchedUserName}</p>
            <button onClick={() => handleStartChat(match.matchedUserId)}>トークを開始</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchedUsers;