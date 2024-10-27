import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function QuestionDetails({ userId }) {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        // 質問の取得
        const questionDoc = await getDoc(doc(db, 'Questions', id));
        if (questionDoc.exists()) {
          setQuestion({ id: questionDoc.id, ...questionDoc.data() });
        }

        // 回答の取得
        const answersQuery = query(collection(db, 'Answers'), where('questionId', '==', id));
        const answersSnapshot = await getDocs(answersQuery);
        const answersData = answersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnswers(answersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchQuestionAndAnswers();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) return;

    try {
      await addDoc(collection(db, 'Answers'), {
        questionId: id,
        userId: userId,
        answer: newAnswer,
        createdAt: new Date(),
      });
      setNewAnswer(""); // 入力欄をクリア
      // 新しい回答をリロード
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
          <h4>回答一覧</h4>
          <ul>
            {answers.map(answer => (
              <li key={answer.id}>{answer.answer}</li>
            ))}
          </ul>
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
        </>
      ) : (
        <p>質問が見つかりません</p>
      )}
    </div>
  );
}

export default QuestionDetails;