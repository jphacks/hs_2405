import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faSmileBeam, faMeh, faFrown, faAngry } from '@fortawesome/free-solid-svg-icons';

const EmotionShare = ({ userId }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [hasSelectedEmotionToday, setHasSelectedEmotionToday] = useState(false);

  const emotions = [
    { id: 'happy', icon: faSmile, label: 'ハッピー' },
    { id: 'relaxed', icon: faSmileBeam, label: 'リラックス' },
    { id: 'neutral', icon: faMeh, label: '普通' },
    { id: 'sad', icon: faFrown, label: '悲しい' },
    { id: 'angry', icon: faAngry, label: '怒っている' }
  ];

  const fetchEmotionHistory = async () => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const snapshot = await getDocs(collection(db, 'UserEmotions'));
      const history = snapshot.docs
        .map(doc => doc.data())
        .filter(data => data.userId === userId && data.date.toDate() >= lastWeek && data.date.toDate() <= today)
        .map(data => ({
          date: data.date.toDate(),
          emotion: data.emotion
        }));

      setEmotionHistory(history);

      const todayEntry = history.find(entry => entry.date.toDateString() === today.toDateString());
      if (todayEntry) {
        setSelectedEmotion(todayEntry.emotion);
        setHasSelectedEmotionToday(true);
      }
    } catch (error) {
      console.error("感情履歴の取得エラー:", error);
    }
  };

  useEffect(() => {
    fetchEmotionHistory();
  }, [userId]);

  const handleEmotionSelect = async (emotionId) => {
    if (hasSelectedEmotionToday) return;

    setSelectedEmotion(emotionId);
    setHasSelectedEmotionToday(true);
    const today = new Date();
    const dateId = `${userId}_${today.toISOString().split('T')[0]}`;

    await setDoc(doc(db, 'UserEmotions', dateId), {
      userId,
      date: Timestamp.fromDate(today),
      emotion: emotionId
    });

    await fetchEmotionHistory();
  };

  const getDateOfPastWeek = () => {
    const today = new Date();
    return [...Array(7)].map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date;
    }).reverse();
  };

  const pastWeekDates = getDateOfPastWeek();

  return (
    <div className="emotion-section">
      <h3>今日の気持ちをシェア</h3>
      {hasSelectedEmotionToday ? (
        <div className="selected-emotion">
          <FontAwesomeIcon 
            icon={emotions.find(emotion => emotion.id === selectedEmotion).icon} 
            size="3x" 
          />
        </div>
      ) : (
        <div className="emotion-icons">
          {emotions.map(emotion => (
            <div 
              key={emotion.id} 
              className={`emotion-icon ${selectedEmotion === emotion.id ? 'selected' : ''}`}
              onClick={() => handleEmotionSelect(emotion.id)}
              title={emotion.label}
            >
              <FontAwesomeIcon icon={emotion.icon} size="2x" />
            </div>
          ))}
        </div>
      )}

      <h3>今週の気持ち</h3>
      <div className="emotion-history">
        {pastWeekDates.map(date => {
          const emotionEntry = emotionHistory.find(entry => entry.date.toDateString() === date.toDateString());
          const emotionIcon = emotionEntry 
            ? emotions.find(e => e.id === emotionEntry.emotion).icon 
            : null;
          return (
            <div key={date.toDateString()} className="emotion-day">
              <p>{date.toLocaleDateString('ja-JP', { weekday: 'short' })}</p>
              {emotionIcon ? <FontAwesomeIcon icon={emotionIcon} size="2x" /> : <p>-</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionShare;