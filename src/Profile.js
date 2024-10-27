import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

function Profile() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [interests, setInterests] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const addUserData = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), {
                userId: user.uid,
                name,
                age,
                interests: interests.split(','),
                createdAt: new Date(),
            });
            console.log('ユーザーが追加されました');
            setSubmitted(true);  // 送信完了のフラグを設定
        } catch (error) {
            console.error('エラー発生:', error);
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p>ログイン中のユーザー: {user.email}</p>
                    <form onSubmit={addUserData}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Interests (comma separated)"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                    {submitted && <p>送信が完了しました！</p>}  {/* 送信完了メッセージを表示 */}
                </div>
            ) : (
                <p>ログインしてください</p>
            )}
        </div>
    );
}

export default Profile;