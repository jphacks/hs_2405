import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Firebase認証インスタンス
import { onAuthStateChanged } from 'firebase/auth';
import PostQuestion from './PostQuestion';

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ユーザーの認証状態を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // ログイン済みならuserIdを設定
      } else {
        setUserId(null); // ログアウト状態ならuserIdをnullに
      }
      setLoading(false); // ローディング状態を終了
    });

    // コンポーネントがアンマウントされたときに監視を解除
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // 認証状態が判明するまでローディング表示
  }

  return (
    <div>
      {userId ? (
        <PostQuestion userId={userId} />
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  );
}

export default App;