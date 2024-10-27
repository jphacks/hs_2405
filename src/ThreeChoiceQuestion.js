import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function ThreeChoiceQuestion({ userId, onAnswerSubmit }) { // userIdを受け取る
  const [question, setQuestion] = useState(null); // ランダムに選んだ1つの質問を保存
  const [selectedAnswer, setSelectedAnswer] = useState(''); // ユーザーの選択を保存
  const navigate = useNavigate(); // navigate フックを使用して画面遷移

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionsSnapshot = await getDocs(collection(db, 'ThreeChoiceQuestions'));
        const questionsData = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // ランダムな質問を選択
        if (questionsData.length > 0) {
          const randomQuestion = questionsData[Math.floor(Math.random() * questionsData.length)];
          setQuestion(randomQuestion);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestion();
  }, []);

  const handleAnswerChange = (choice) => {
    setSelectedAnswer(choice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("ユーザーIDが無効です");
      return;
    }

    try {
      await addDoc(collection(db, 'UserAnswers'), {
        userId: userId,  // ログイン中のユーザーID
        questionId: question.id,
        answer: selectedAnswer,
        submittedAt: new Date(),
      });
      console.log('回答が保存されました');
      onAnswerSubmit(selectedAnswer); // 上位コンポーネントに回答を通知
      navigate('/osusume'); // 回答後に遷移
    } catch (error) {
      console.error('回答の保存に失敗しました:', error);
    }
  };

  return (
    <div>
      <h2>価値観確認 - 三択質問</h2>
      {question ? (
        <form onSubmit={handleSubmit}>
          <h3>{question.text}</h3>
          {(question.choices || []).map(choice => ( // choices が undefined の場合の安全策
            <label key={choice}>
              <input
                type="radio"
                name={question.id}
                value={choice}
                checked={selectedAnswer === choice}
                onChange={() => handleAnswerChange(choice)}
              />
              {choice}
            </label>
          ))}
          <button type="submit">回答を送信</button>
        </form>
      ) : (
        <p>Loading question...</p> // 質問がロード中の場合の表示
      )}
    </div>
  );
}

export default ThreeChoiceQuestion;