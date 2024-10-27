
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const roomRef = useRef(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId'); // ユーザーIDを取得
    const userName = queryParams.get('userName'); // ユーザー名を取得

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log('メッセージを送信:', message);
            setMessage('');
        }
    };

    useEffect(() => {
        if (roomRef.current) {
            roomRef.current.scrollTop = roomRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            {/* チャット相手の名前を表示 */}
            <h3>{userName}とのチャット</h3>
            <div
                id="room"
                ref={roomRef}
                style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }} // メッセージ表示領域のスタイル
            >
                {/* 送信したメッセージを表示 */}
                {messages.slice().reverse().map((msg, index) => (
                    <div key={index} style={styles.messageBubble}>
                        {msg}
                    </div>
                ))}
            </div>

            <div className="input-group chat-input">
                <input
                    id="inputMessage"
                    type="text"
                    className="form-control"
                    placeholder="メッセージを入力してください"
                    value={message}
                    onChange={handleInputChange}
                    style={{ width: '200px', height: '40px' }} // 入力欄のスタイルを調整
                />
                <div className="input-group-append">
                    <button
                        id="sendBtn"
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSendMessage}
                        disabled={message.trim() === ''} // 空メッセージのときはボタンを無効に
                    >
                        送信
                    </button>
                </div>
            </div>
        </div>
    );
};

// メッセージバブルのスタイル
const styles = {
    messageBubble: {
        borderRadius: '15px', // 端を丸くする
        backgroundColor: '#f0f0f0', // 背景色
        padding: '10px', // パディング
        margin: '5px 0', // メッセージ間のマージン
        maxWidth: '300px', // バブルの最大幅
        wordWrap: 'break-word', // 単語の折り返し
    },
};

export default Chat;
