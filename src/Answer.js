import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function Answer({ questionId }) {
  const [answerText, setAnswerText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionId) {
      console.error("質問IDが無効です。回答を投稿できません。");
      setMessage("質問IDが無効です。回答を投稿できません。");
      return;
    }

    try {
      await addDoc(collection(db, 'Answers'), {
        answer: answerText,
        questionId: questionId,
        createdAt: Timestamp.now(),
      });
      setAnswerText('');
      setMessage('回答が投稿されました');
    } catch (error) {
      console.error('回答の投稿に失敗しました:', error);
      setMessage('回答の投稿に失敗しました');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h3>回答を投稿</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="回答を入力してください"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          required
        />
        <button type="submit">投稿</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Answer;