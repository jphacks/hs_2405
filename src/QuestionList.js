import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function QuestionList({ userId }) { // Pass userId as a prop
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionSnapshot = await getDocs(collection(db, 'Questions'));
        const questionData = questionSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(question => question.userId !== userId); // Filter out user's own questions
          
        setQuestions(questionData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [userId]); // Add userId to dependencies

  return (
    <div>
      <h2>質問一覧</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            {/* Link to the answer page */}
            <Link to={`/questions/${question.id}`}>{question.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;