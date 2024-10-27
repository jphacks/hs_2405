// checkValuesMatch.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

async function getAnswerForQuestion(userId, questionId) {
  const q = query(
    collection(db, 'ThreeChoiceAnswers'),
    where('userId', '==', userId),
    where('questionId', '==', questionId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : querySnapshot.docs[0].data().answer;
}

export async function checkValuesMatch(userAId, userBId) {
  try {
    const questions = await getDocs(collection(db, 'ThreeChoiceQuestions'));
    for (const question of questions.docs) {
      const questionId = question.id;

      const answerA = await getAnswerForQuestion(userAId, questionId);
      const answerB = await getAnswerForQuestion(userBId, questionId);

      if (answerA === answerB) return true; // 1つでも一致したら true を返す
    }
    return false; // すべての質問で不一致だった場合は false
  } catch (error) {
    console.error('価値観の一致確認エラー:', error);
    return false;
  }
}