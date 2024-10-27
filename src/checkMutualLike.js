import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function checkMutualLike(fromUserId, toUserId) {
  try {
    // fromUserId から toUserId への「いいね」を確認
    const likeFromToQuery = query(
      collection(db, 'Likes'),
      where('fromUserId', '==', fromUserId),
      where('toUserId', '==', toUserId),
      where('evaluation', '==', 'like')
    );
    const likeFromToSnapshot = await getDocs(likeFromToQuery);

    // toUserId から fromUserId への「いいね」を確認
    const likeToFromQuery = query(
      collection(db, 'Likes'),
      where('fromUserId', '==', toUserId),
      where('toUserId', '==', fromUserId),
      where('evaluation', '==', 'like')
    );
    const likeToFromSnapshot = await getDocs(likeToFromQuery);

    // 双方からの「いいね」が存在するかどうかを確認
    return !likeFromToSnapshot.empty && !likeToFromSnapshot.empty;
  } catch (error) {
    console.error('相互「いいね」の確認エラー:', error);
    return false;
  }
}