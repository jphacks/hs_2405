import React from 'react';
import { Link } from 'react-router-dom';

function Osusume() {
  return (
    <div>
      <h1>Osusume</h1>
      <ul>
        <li><Link to="/questions/add">Post Question</Link></li>
        <li><Link to="/questions">Questions List</Link></li>
        <li><Link to="/threechoice">Three Choice Questions</Link></li> 
        <li><Link to="/myquestions">my question</Link></li>
        <li><Link to="/matches">match</Link></li>
      </ul>
    </div>
  );
}

export default Osusume;