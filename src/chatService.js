// chatService.js
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function getOrCreateChat(userId, matchedUserId) {
  // 既存チャットがあるかチェック
  const chatQuery = query(
    collection(db, 'Chats'),
    where('user1', 'in', [userId, matchedUserId]),
    where('user2', 'in', [userId, matchedUserId])
  );

  const chatSnapshot = await getDocs(chatQuery);
  if (!chatSnapshot.empty) {
    return chatSnapshot.docs[0].id;  // 既存のチャットIDを返す
  }

  // 新しいチャットを作成
  const newChatRef = await addDoc(collection(db, 'Chats'), {
    user1: userId,
    user2: matchedUserId,
    messages: []  // 空のメッセージリストで初期化
  });
  return newChatRef.id;
}