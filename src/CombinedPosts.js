import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const getStrTime = (time) => {
    let t = new Date(time);
    return (`${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`);
};

const CombinedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false); // ローディング状態

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
            setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.created_at - a.created_at));
        });

        return () => unsubscribe(); // クリーンアップ
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            alert("タイトルと内容は必須です"); // バリデーションメッセージ
            return;
        }

        setLoading(true); // 投稿処理中にローディングを表示

        try {
            await addDoc(collection(db, "posts"), {
                title: title,
                content: content,
                created_at: new Date().getTime()
            });
            setTitle('');
            setContent('');
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setLoading(false); // ローディングを解除
        }
    };

    return (
        <div>
            <h2>新規投稿</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={title}
                    placeholder='タイトル'
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    value={content}
                    placeholder='内容'
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type='submit' disabled={loading}>{loading ? '投稿中...' : '投稿'}</button> {/* ローディング表示 */}
            </form>

            <h2>投稿一覧</h2>
            {posts.length === 0 ? (
                <p>投稿が見つかりませんでした。</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className='post'>
                        <div className='title'>タイトル：{post.title}</div>
                        <div className='content'>内容：{post.content}</div>
                        <div className='created_at'>投稿日：{getStrTime(post.created_at)}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CombinedPosts;
