import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import './styles/MyQuestionDetails.css';
import { checkMutualLike } from './checkMutualLike';
import { saveMatch } from './saveMatch';

function QuestionDetails({ userId }) {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionDoc = await getDoc(doc(db, 'Questions', id));
        if (questionDoc.exists()) {
          setQuestion({ id: questionDoc.id, ...questionDoc.data() });
        }

        const answersQuery = query(collection(db, 'Answers'), where('questionId', '==', id));
        const answersSnapshot = await getDocs(answersQuery);
        const answersData = answersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAnswers(answersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchQuestionAndAnswers();
  }, [id]);

 const handleEvaluateAnswer = async (answerId, evaluation) => {
  try {
    const answer = answers.find(answer => answer.id === answerId);
    const answerOwnerId = answer ? answer.answerOwnerId : null;

    if (!answerOwnerId) {
      console.error("回答の所有者IDが見つかりませんでした");
      return;
    }

    if (userId === answerOwnerId) {
      console.log("同一ユーザーによる評価はスキップされました");
      return;
    }

    const likeQuery = query(
      collection(db, 'Likes'),
      where('answerId', '==', answerId),
      where('fromUserId', '==', userId)
    );
    const likeSnapshot = await getDocs(likeQuery);

    if (!likeSnapshot.empty) {
      console.log("既に評価済みです");
      return;
    }

    const answerRef = doc(db, 'Answers', answerId);
    await updateDoc(answerRef, { evaluation, evaluatedBy: userId });

    await addDoc(collection(db, 'Likes'), {
      answerId,
      evaluation,
      fromUserId: userId,
      toUserId: answerOwnerId,
      timestamp: new Date()
    });

    const isMutualLike = await checkMutualLike(userId, answerOwnerId);
    if (isMutualLike) {
      await saveMatch(userId, answerOwnerId);
    }

    setAnswers(prevAnswers => {
      return prevAnswers.map(answer => 
        answer.id === answerId
          ? { ...answer, evaluation, evaluatedBy: userId }
          : answer
      );
    });
  } catch (error) {
    console.error("Error updating evaluation:", error);
    alert("エラーが発生しました。もう一度お試しください。");
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>質問詳細</h2>
      {question ? (
        <>
          <h2>{question.question}</h2>
          <h3>回答一覧と評価</h3>
          <ul>
            {answers.map(answer => (
              <li key={answer.id}>
                <h4>{answer.answer}</h4>
                {answer.evaluation ? (
                  <p className="evaluation-result">
                    {answer.evaluation === 'like' ? (
                      <span className="liked"><FontAwesomeIcon icon={faThumbsUp} /> いいね</span>
                    ) : (
                      <span className="nope"><FontAwesomeIcon icon={faThumbsDown} /> nope</span>
                    )}
                  </p>
                ) : (
                  <div className="button-group">
                    <button className="like" onClick={() => handleEvaluateAnswer(answer.id, 'like')}>
                      <FontAwesomeIcon icon={faThumbsUp} /> いいね
                    </button>
                    <button className="nope" onClick={() => handleEvaluateAnswer(answer.id, 'nope')}>
                      <FontAwesomeIcon icon={faThumbsDown} /> nope
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>質問が見つかりません</p>
      )}
      <Link to="/osusume" className="back-link"><h4>Go back to matching page</h4></Link>
    </div>
  );
}

export default QuestionDetails;