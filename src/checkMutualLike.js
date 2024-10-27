import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function checkMutualLike(userId) {
  try {
    // 1. `userId`が「いいね」したすべてのユーザーを取得
    const likeFromUserQuery = query(
      collection(db, 'Likes'),
      where('fromUserId', '==', userId),
      where('evaluation', '==', 'like')
    );
    const likeFromUserSnapshot = await getDocs(likeFromUserQuery);
    const likedUserIds = likeFromUserSnapshot.docs.map(doc => doc.data().toUserId);

    // 2. `userId`に「いいね」しているユーザーを一度に取得
    const likeToUserQuery = query(
      collection(db, 'Likes'),
      where('toUserId', '==', userId),
      where('evaluation', '==', 'like')
    );
    const likeToUserSnapshot = await getDocs(likeToUserQuery);
    const mutualUserIds = likeToUserSnapshot.docs.map(doc => doc.data().fromUserId);

    // 3. 双方のリストに共通するユーザーのみを抽出してマッチを保存
    const mutualLikes = likedUserIds.filter(likedUserId => mutualUserIds.includes(likedUserId));

    // 4. マッチを双方向に保存
    for (const matchedUserId of mutualLikes) {
      // 両方のユーザー間でマッチが保存されていない場合のみ保存
      const matchExistsQuery = query(
        collection(db, 'UserMatches'),
        where('userId', '==', userId),
        where('matchedUserId', '==', matchedUserId)
      );
      const reverseMatchExistsQuery = query(
        collection(db, 'UserMatches'),
        where('userId', '==', matchedUserId),
        where('matchedUserId', '==', userId)
      );

      const [matchExistsSnapshot, reverseMatchExistsSnapshot] = await Promise.all([
        getDocs(matchExistsQuery),
        getDocs(reverseMatchExistsQuery),
      ]);

      // 双方向にマッチが保存されていなければ新たに保存
      if (matchExistsSnapshot.empty && reverseMatchExistsSnapshot.empty) {
        await Promise.all([
          addDoc(collection(db, 'UserMatches'), {
            userId: userId,
            matchedUserId: matchedUserId,
            timestamp: new Date()
          }),
          addDoc(collection(db, 'UserMatches'), {
            userId: matchedUserId,
            matchedUserId: userId,
            timestamp: new Date()
          })
        ]);
        console.log(`相互マッチが保存されました: ${userId} と ${matchedUserId}`);
      } else {
        console.log(`既にマッチが存在しています: ${userId} と ${matchedUserId}`);
      }
    }
  } catch (error) {
    console.error('マッチングエラー:', error);
  }
}