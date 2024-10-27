import { collection, onSnapshot } from 'firebase/firestore'
import {React, useEffect, useState } from 'react'
import {db} from "./firebase";

const getStrTime = (time) => {
    let t = new Date(time);
    return (`${t.getFullYear()}/${t.getMonth()+1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`);
}

const AllPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        onSnapshot(collection(db, 'posts'), (posts) => {
            setPosts(
                posts.docs.map((post) => post.data()).sort((a,b) => b.created_at - a.created_at)
            )
        })
    }, []);

    return (
        <>
            <p>投稿一覧</p>
            {posts.map((post) => (
                <div className='post'>
                    <div className='title'>タイトル：{post.title}</div>
                    <div className='content'>内容：{post.content}</div>
                    <div className='created_at'>投稿日：{getStrTime(post.created_at)}</div>
                </div>
            ))}
        </>
    );
}

export default AllPosts
