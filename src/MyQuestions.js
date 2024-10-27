import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function MyQuestions({ userId }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'Questions'), where('userId', '==', userId));
        const questionSnapshot = await getDocs(q);
        const questionData = questionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [userId]);

  return (
    <div>
      <h2>自分の質問一覧</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            {/* 評価ページへのリンクを /myquestions/:id に変更 */}
            <Link to={`/myquestions/${question.id}`}>{question.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyQuestions;