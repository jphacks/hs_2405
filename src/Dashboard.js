import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // ページ遷移用のフック

function Dashboard({ userId }) {
  const [userProfile, setUserProfile] = useState(null); // 自分のプロフィール
  const [matches, setMatches] = useState([]); // マッチしたユーザーのプロフィール情報
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // navigateを使ってページ遷移を実行

  useEffect(() => {
    const fetchProfileAndMatches = async () => {
      try {
        // プロフィールの取得
        const userDoc = await getDoc(doc(db, 'users', userId));
        console.log("ユーザープロフィールの取得:", userDoc.data());
        if (userDoc.exists()) {
          setUserProfile({ id: userDoc.id, ...userDoc.data() });
        } else {
          console.log("ユーザープロフィールが存在しません");
        }

        // マッチの取得
        const matchesQuery = query(
          collection(db, 'UserMatches'),
          where('userId', '==', userId)
        );
        const matchSnapshot = await getDocs(matchesQuery);

        const matchedProfiles = await Promise.all(
          matchSnapshot.docs.map(async (doc) => {
            const matchedUserId = doc.data().matchedUserId;
            const userDoc = await getDoc(doc(db, 'users', matchedUserId));
            return { id: matchedUserId, ...userDoc.data() };
          })
        );
        setMatches(matchedProfiles);
      } catch (error) {
        console.error("fetchProfileAndMatches 関数内のエラー:", error);
      } finally {
        // データ取得が完了したので loading 状態を解除
        setLoading(false);
      }
    };

    fetchProfileAndMatches();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      {/* 自分のプロフィールセクション */}
      <div className="profile-card">
        <h2>自分のプロフィール</h2>
        {userProfile ? (
          <div>
            <p><strong>ユーザー名:</strong> {userProfile.name}</p>
            <p><strong>年齢:</strong> {userProfile.age}</p>
            <p><strong>自己紹介:</strong> {userProfile.bio}</p>
          </div>
        ) : (
          <div>
            <p>プロフィール情報が見つかりません。</p>
            <button onClick={() => navigate('/profile')}>
              プロフィールを作成・編集する
            </button>
          </div>
        )}
      </div>

      {/* マッチしたユーザーのプロフィール一覧 */}
      <div className="matches-section">
        <h2>マッチしたユーザー</h2>
        <div className="matches-grid">
          {matches.length > 0 ? (
            matches.map(match => (
              <div key={match.id} className="match-card">
                <p><strong>ユーザー名:</strong> {match.name}</p>
                <p><strong>年齢:</strong> {match.age}</p>
                <p><strong>自己紹介:</strong> {match.bio}</p>
              </div>
            ))
          ) : (
            <p>マッチしたユーザーはいません。</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
