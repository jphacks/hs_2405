import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function MatchedUsers({ userId }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const q = query(collection(db, 'UserMatches'), where('userId', '==', userId));
        const matchSnapshot = await getDocs(q);
        const matchData = matchSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMatches(matchData);
      } catch (error) {
        console.error('マッチデータの取得エラー:', error);
      }
    };

    fetchMatches();
  }, [userId]);

  return (
    <div>
      <h2>マッチしたユーザー</h2>
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            <p>マッチユーザーID: {match.matchedUserId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchedUsers;