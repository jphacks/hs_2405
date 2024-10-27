import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function PostQuestion({ userId }) {
  const [questionText, setQuestionText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // userIdが無効な場合、エラーメッセージを表示して投稿を中止
    if (!userId) {
      console.error("ユーザーIDが無効です。質問を投稿できません。");
      setMessage("ユーザーIDが無効です。質問を投稿できません。");
      return;
    }

    try {
      await addDoc(collection(db, 'Questions'), {
        question: questionText,
        userId: userId,
        createdAt: Timestamp.now(),
      });
      setQuestionText('');
      setMessage('質問が投稿されました');
    } catch (error) {
      console.error('質問の投稿に失敗しました:', error);
      setMessage('質問の投稿に失敗しました');
    }

    // メッセージを3秒後にクリア
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2>質問を投稿</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="質問を入力してください"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
        <button type="submit">投稿</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PostQuestion;