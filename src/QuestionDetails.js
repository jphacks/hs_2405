import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { useParams, Link} from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import './styles/QuestionDetails.css';

function QuestionDetails({ userId }) {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false); // すでに回答済みかどうか

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        // 質問の取得
        const questionDoc = await getDoc(doc(db, 'Questions', id));
        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          setQuestion({ id: questionDoc.id, ...questionData });
        }

        // 回答の取得
        const answersQuery = query(collection(db, 'Answers'), where('questionId', '==', id));
        const answersSnapshot = await getDocs(answersQuery);
        const answersData = answersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnswers(answersData);

        // 現在のユーザーが回答済みかチェック
        const userAnswer = answersData.find(answer => answer.answerOwnerId === userId);
        if (userAnswer) setHasAnswered(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchQuestionAndAnswers();
  }, [id, userId]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) return;

    try {
      // `userId` が既に回答済みの場合は投稿を中止
      if (hasAnswered) {
        console.log("すでに回答済みです。");
        return;
      }

      // `userId` を `answerOwnerId` として Answers コレクションに新しい回答を追加
      await addDoc(collection(db, 'Answers'), {
        questionId: id,
        answerOwnerId: userId, // 回答者のIDとしてログインしているユーザーIDを保存
        answer: newAnswer,
        createdAt: new Date()
      });

      setNewAnswer(""); // 入力欄をクリア
      setHasAnswered(true); // 回答済みフラグを設定

      // 新しい回答を再取得
      const answersQuery = query(collection(db, 'Answers'), where('questionId', '==', id));
      const answersSnapshot = await getDocs(answersQuery);
      const answersData = answersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnswers(answersData);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div>
      <h2>質問詳細</h2>
      {question ? (
        <>
          <h3>{question.question}</h3>
          {hasAnswered ? (
            <p>この質問にはすでに回答しています。</p>
          ) : (
            <form onSubmit={handleAnswerSubmit}>
              <input
                type="text"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="回答を入力してください"
                required
              />
              <button type="submit">回答を投稿</button>
            </form>
          )}
          <Link to="/osusume">Go back to matching page</Link>
        </>
      ) : (
        <p>質問が見つかりません</p>
      )}
    </div>
  );
}

export default QuestionDetails;