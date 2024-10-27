import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Osusume.css';

function Osusume() {
  return (
    <div>
      <h1>Matching Page</h1>
      <div className="how-to-match">
        <h2>マッチングの仕方</h2>
        <p>マッチするには、まず質問を投稿し、回答をもらいます。</p>
        <p>その後、気に入った回答に「いいね」をしてください。</p>
        <p>次に、その回答者が投稿した質問に回答し、相手から「いいね」をもらいます。</p>
        <p>お互いに「いいね」をし合うと、マッチが成立します！</p>
      </div>
      <ul>
        <li><Link to="/questions/add">Post Question</Link></li>
        <li><Link to="/questions">Questions List</Link></li>
        <li><Link to="/myquestions">my question</Link></li>
        <li><Link to="/matches">match</Link></li>
      </ul>
      <Link to="/dashboard">Go to dashboard</Link>
    </div>
  );
}

export default Osusume;