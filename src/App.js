import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import EditProfile from './Profile';
import CombinedPosts from './CombinedPosts';
import Question from './Question';
import QuestionList from './QuestionList';
import QuestionDetails from './QuestionDetails';
import MyQuestionDetails from './MyQuestionDetails';
import Osusume from './Osusume';
import Chat from './Chat';
import AddThreeChoiceQuestions from './AddThreeChoiceQuestions';
import ThreeChoiceQuestion from './ThreeChoiceQuestion';
import MyQuestions from './MyQuestions';
import MatchedUsers from './MatchedUsers';
import ChatLayout from './ChatLayout';


function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAnswerSubmit = async (answers) => {
    try {
      await addDoc(collection(db, 'UserAnswers'), {
        userId,
        answers,
        submittedAt: new Date()
      });
      console.log('回答が保存されました');
    } catch (error) {
      console.error('回答の保存に失敗しました:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard currentUserId={userId} />} />
      <Route path="/dashboard/:profileUserId" element={<Dashboard currentUserId={userId} />} /> {/* 追加 */}
      <Route path="/profile" element={<EditProfile userId={userId} />} /> 
      <Route path="/combinedposts" element={<CombinedPosts />} />
      <Route path="/questions" element={<QuestionList userId={userId} />} />
      <Route path="/questions/add" element={userId ? <Question userId={userId} /> : <Navigate to="/login" />} />
      <Route path="/questions/:id" element={<QuestionDetails userId={userId} />} />
      <Route path="/myquestions" element={<MyQuestions userId={userId} />} />
      <Route path="/myquestions/:id" element={<MyQuestionDetails userId={userId} />} /> 
      <Route path="/osusume" element={<Osusume />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/addthreequestions" element={<AddThreeChoiceQuestions />} />
      <Route path="/threechoice" element={<ThreeChoiceQuestion userId={userId} onAnswerSubmit={handleAnswerSubmit} />} />
      <Route path="/matches" element={<MatchedUsers userId={userId} />} />
      <Route path="/chat/:chatId" element={<ChatLayout userId={userId} />} />
    </Routes>
  );
}

export default App;
