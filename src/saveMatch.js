// saveMatch.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function saveMatch(fromUserId, toUserId) {
  try {
    await addDoc(collection(db, 'UserMatches'), {
      userId: fromUserId,
      matchedUserId: toUserId,
      timestamp: new Date()
    });
    console.log(`User ${fromUserId} と ${toUserId} のマッチが保存されました`);
  } catch (error) {
    console.error('マッチ保存エラー:', error);
  }
}
