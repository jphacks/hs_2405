// saveMatch.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function saveMatch(userId, matchedUserId) {
  try {
    await addDoc(collection(db, 'UserMatches'), {
      userId,
      matchedUserId,
      matchedAt: new Date(),
    });
    console.log('マッチが保存されました');
  } catch (error) {
    console.error('マッチ保存エラー:', error);
  }
}