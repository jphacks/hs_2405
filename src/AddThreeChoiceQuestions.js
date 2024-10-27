import React from 'react';
import { db } from './firebase'; // firebase の初期設定ファイル
import { collection, addDoc } from 'firebase/firestore';

function AddThreeChoiceQuestions() {
  const addQuestions = async () => {
    const questionsData = [
      {
        text: "あなたにとって、もっとも大切なものは？",
        choices: ["家族", "仕事", "自分の時間"]
      },
      {
        text: "休日の過ごし方は？",
        choices: ["アウトドアで過ごす", "家でリラックス", "趣味やスキルを磨く"]
      },
      {
        text: "旅行先を選ぶときの基準は？",
        choices: ["自然や景色がきれいな場所", "美味しい食べ物や文化体験がある場所", "アクティビティが豊富な場所"]
      },
      {
        text: "あなたにとって理想の住まいの環境は？",
        choices: ["都会で便利な場所", "郊外や自然が豊かな場所", "海外で新しい経験ができる場所"]
      },
      {
        text: "仕事を選ぶ基準は？",
        choices: ["給与や待遇", "やりがいや成長の機会", "ワークライフバランス"]
      },
      {
        text: "好きな季節は？",
        choices: ["春", "夏", "冬"]
      },
      {
        text: "友人と過ごすならどんな場所が好き？",
        choices: ["カフェやレストランでゆっくり話す", "外でアクティビティを楽しむ", "家で映画やゲームを楽しむ"]
      },
      {
        text: "あなたの理想的な週末の過ごし方は？",
        choices: ["スポーツや運動をする", "家でのんびりリラックス", "新しい場所やレストランを探索する"]
      },
      {
        text: "食事で大切にしていることは？",
        choices: ["ヘルシーで栄養バランスが良いこと", "味や見た目が良いこと", "手軽で簡単に用意できること"]
      },
      {
        text: "どんなタイプの本が好き？",
        choices: ["小説やフィクション", "ビジネスや自己啓発", "ノンフィクションやドキュメンタリー"]
      }
    ];

    try {
      // Firestore に各質問を個別に追加
      for (const question of questionsData) {
        await addDoc(collection(db, 'ThreeChoiceQuestions'), question);
      }
      console.log("三択質問が個別に追加されました");
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div>
      <h2>三択質問を追加</h2>
      <button onClick={addQuestions}>質問を追加</button>
    </div>
  );
}

export default AddThreeChoiceQuestions;