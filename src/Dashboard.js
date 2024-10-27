import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot, updateDoc, addDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import EmotionShare from './EmotionShare';
import './styles/Dashboard.css';

function Dashboard({ currentUserId }) {
  const { profileUserId } = useParams(); 
  const userId = profileUserId || currentUserId;
  const [userProfile, setUserProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [questions, setQuestions] = useState([]); // questionsを初期化
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // 現在表示中のマッチのインデックス
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false); // フェードエフェクト用の状態
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndMatches = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserProfile({ id: userDoc.id, ...userDoc.data() });
        } else {
          console.log("ユーザープロフィールが存在しません");
        }

        if (userId === currentUserId) {
          const matchesQuery = query(
            collection(db, 'UserMatches'),
            where('userId', '==', currentUserId)
          );

          const unsubscribe = onSnapshot(matchesQuery, async (snapshot) => {
            const matchedProfiles = await Promise.all(
              snapshot.docs.map(async (matchDoc) => {
                const matchedUserId = matchDoc.data().matchedUserId;
                const userSnapshot = await getDoc(doc(db, 'users', matchedUserId));
                return { id: matchedUserId, ...userSnapshot.data() };
              })
            );
            setMatches(matchedProfiles);
          });

          return unsubscribe;
        }
      } catch (error) {
        console.error("エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuestionsAndAnswers = async () => {
      try {
        const questionsQuery = query(collection(db, 'Questions'), where('userId', '==', userId));
        const questionsSnapshot = await getDocs(questionsQuery);

        const questionsData = await Promise.all(
          questionsSnapshot.docs.map(async (doc) => {
            const question = { id: doc.id, ...doc.data() };
            const answersQuery = query(collection(db, 'Answers'), where('questionId', '==', doc.id));
            const answersSnapshot = await getDocs(answersQuery);
            const answers = answersSnapshot.docs.map(answerDoc => ({
              id: answerDoc.id,
              ...answerDoc.data()
            }));
            return { ...question, answers };
          })
        );

        setQuestions(questionsData);
      } catch (error) {
        console.error("質問と回答の取得エラー:", error);
      }
    };

    fetchProfileAndMatches();
    fetchQuestionsAndAnswers(); // この位置でfetchQuestionsAndAnswersを呼び出す
  }, [userId, currentUserId]);

  // 一定時間ごとに表示するマッチのユーザーを切り替える
  useEffect(() => {
    if (matches.length > 1) {
      const interval = setInterval(() => {
        setFade(true); // フェードアウト開始
        setTimeout(() => {
          setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
          setFade(false); // フェードイン開始
        }, 500); // フェードアウトの間隔
      }, 5000); // 5秒ごとに切り替え

      return () => clearInterval(interval); // コンポーネントがアンマウントされた時にクリア
    }
  }, [matches]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="profile-and-emotion">
        <div className="profile-card">
          <h4>{userId === currentUserId ? '自分のプロフィール' : 'ユーザープロフィール'}</h4>
          {userProfile ? (
            <div>
              <p><strong>ユーザー名:</strong> {userProfile.name}</p>
              <p><strong>自己紹介:</strong> {userProfile.bio || '自己紹介がありません。'}</p>
            </div>
          ) : (
            <p>プロフィール情報が見つかりません。</p>
          )}
        </div>

        {userId === currentUserId && <EmotionShare userId={userId} />}
      </div>

      {userId === currentUserId && (
        <div className="matches-section">
          <h2>マッチしたユーザー</h2>
          <div className="matches-grid">
            {matches.length > 0 ? (
             <div className={`match-card ${fade ? 'fade' : ''}`} onClick={() => navigate(`/dashboard/${matches[currentMatchIndex].id}`)}>
              <h3 className="match-name"><strong>ユーザー名:</strong> {matches[currentMatchIndex].name}</h3> 
              <p className="match-bio"><strong>自己紹介:</strong> {matches[currentMatchIndex].bio || '自己紹介がありません。'}</p>
              <FontAwesomeIcon 
                icon={faCommentDots} 
                className="chat-icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${matches[currentMatchIndex].id}`);
                }}
              />
            </div>
            ) : (
              <p>マッチしたユーザーはいません。</p>
            )}
          </div>
        </div>
      )}
      <div className="osusume">
        <Link to="/osusume">Go to matching page</Link>
      </div>

    </div>
  );
}

export default Dashboard;