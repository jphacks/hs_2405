import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Dashboard.css'; // スタイル用のCSSをインポート

const db = getFirestore();

function Dashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // 読み込み状態

    // ユーザーの認証状態を監視
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/login');
            }
        });
        return unsubscribe;
    }, [navigate]);

    // Firestoreからユーザーを取得
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            } catch (error) {
                console.error("ユーザーの取得中にエラーが発生しました:", error);
            } finally {
                setLoading(false); // データ取得後に読み込みをfalseにする
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        navigate(`/chat?userId=${user.id}&userName=${user.name}`); // チャットページに遷移
    };

    return (
        <div className="dashboard">
            <h2 className="dashboard-header">ダッシュボード</h2>
            <p>これはメインのダッシュボードページです。</p>
            {loading ? (
                <p>ユーザーを読み込み中...</p>
            ) : users.length === 0 ? (
                <p>ユーザーが見つかりませんでした。</p>
            ) : (
                <div className="user-list">
                    {users.map((user) => (
                        <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
                            <p className="user-name">{user.name}</p>
                            <p><strong>年齢:</strong> {user.age}</p>
                            <p><strong>興味:</strong> {user.interests.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
