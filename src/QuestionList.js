import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionSnapshot = await getDocs(collection(db, 'Questions'));
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
  }, []);

  return (
    <div>
      <h2>質問一覧</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            {/* 回答ページにリンク */}
            <Link to={`/questions/${question.id}`}>{question.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;