import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { checkMutualLike } from './checkMutualLike'; // 相互「いいね」確認関数をインポート
import { saveMatch } from './saveMatch'; // マッチを保存する関数をインポート

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

        // デバッグ: answerOwnerIdの有無を確認
        answersData.forEach(answer => {
          console.log(`Answer ID: ${answer.id}, Owner ID: ${answer.answerOwnerId}`);
        });

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

    // 同じユーザーによる評価はスキップする
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
    console.log(`評価が保存されました: ${evaluation}, by ${userId}`);

    await addDoc(collection(db, 'Likes'), {
      answerId,
      evaluation,
      fromUserId: userId,
      toUserId: answerOwnerId,
      timestamp: new Date()
    });
    console.log(`評価がLikesコレクションに保存されました: ${evaluation}, by ${userId}`);

    const isMutualLike = await checkMutualLike(userId, answerOwnerId);
    if (isMutualLike) {
      await saveMatch(userId, answerOwnerId);
      console.log(`相互「いいね」により、ユーザー ${userId} と ${answerOwnerId} のマッチが保存されました`);
    }

    setAnswers(prevAnswers => {
      const index = prevAnswers.findIndex(answer => answer.id === answerId);
      if (index === -1) return prevAnswers;

      const updatedAnswer = {
        ...prevAnswers[index],
        evaluation,
        evaluatedBy: userId
      };

      return [
        ...prevAnswers.slice(0, index),
        updatedAnswer,
        ...prevAnswers.slice(index + 1)
      ];
    });
  } catch (error) {
    console.error("Error updating evaluation:", error);
    alert("エラーが発生しました。もう一度お試しください。");
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>質問詳細</h2>
      {question ? (
        <>
          <h3>{question.question}</h3>
          <h4>回答一覧と評価</h4>
          <ul>
            {answers.map(answer => (
              <li key={answer.id}>
                <p>{answer.answer}</p>
                <button onClick={() => handleEvaluateAnswer(answer.id, 'like')}>
                  いいね
                </button>
                <button onClick={() => handleEvaluateAnswer(answer.id, 'nope')}>
                  nope
                </button>
                <p>評価: {answer.evaluation || '未評価'}</p>
                <p>評価者: {answer.evaluatedBy || '未評価'}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>質問が見つかりません</p>
      )}
    </div>
  );
}

export default QuestionDetails;