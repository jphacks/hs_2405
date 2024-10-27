import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function EditProfile({ userId }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // プロフィールデータを取得
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'users', userId));
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setName(profileData.name || '');
          setBio(profileData.bio || '');
        }
      } catch (error) {
        console.error("プロフィールの取得エラー:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    try {
      // userIdもデータに含めて保存
      await setDoc(doc(db, 'users', userId), { userId, name, bio });
      alert("プロフィールが保存されました");
    } catch (error) {
      console.error("プロフィールの保存エラー:", error);
    }
  };

  return (
    <div>
      <h2>プロフィールを編集</h2>
      <input type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="自己紹介" value={bio} onChange={(e) => setBio(e.target.value)} />
      <button onClick={handleSaveProfile}>保存</button>
    </div>
  );
}

export default EditProfile;