// matchUsers.js
import { checkMutualLike } from './checkMutualLike';
import { checkValuesMatch } from './checkValuesMatch';
import { saveMatch } from './saveMatch';

export async function matchUsers(userAId, userBId) {
  try {
    console.log(`--- マッチング開始 ---`);
    console.log(`マッチングをチェック中: ${userAId} と ${userBId}`);

    // Step 1: 双方が「いいね」をしているか確認
    const likesAtoB = await checkMutualLike(userAId, userBId);
    const likesBtoA = await checkMutualLike(userBId, userAId);

    console.log(`いいね確認結果: ${userAId} -> ${userBId}: ${likesAtoB}, ${userBId} -> ${userAId}: ${likesBtoA}`);
    if (!likesAtoB || !likesBtoA) {
      console.log(`マッチング不可: 双方のいいねが不足 (${userAId} -> ${userBId}: ${likesAtoB}, ${userBId} -> ${userAId}: ${likesBtoA})`);
      return; // 双方が「いいね」をしていない場合、終了
    }
    console.log(`「いいね」一致確認済み: ${userAId} と ${userBId}`);

    // Step 2: 価値観の一致を確認
    const valuesMatch = await checkValuesMatch(userAId, userBId);
    console.log(`価値観一致確認結果: ${valuesMatch}`);
    if (!valuesMatch) {
      console.log(`マッチング不可: 価値観が一致しない (${userAId} と ${userBId})`);
      return; // 価値観が一致しない場合、終了
    }
    console.log(`価値観一致確認済み: ${userAId} と ${userBId}`);

    // Step 3: マッチが成立した場合、マッチ情報を保存
    await saveMatch(userAId, userBId);
    console.log(`マッチが確定しました: ${userAId} と ${userBId}`);
    console.log(`--- マッチング完了 ---`);
  } catch (error) {
    console.error(`マッチング処理エラー (${userAId} と ${userBId}):`, error);
  }
}