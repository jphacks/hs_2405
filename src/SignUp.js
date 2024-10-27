import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from './Full Logo.png';  // Update the path to your image file

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential.user);
      navigate('/osusume');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      console.log('User logged in with Google:', userCredential.user);
      navigate('/osusume');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="BlueMoon Logo" className="logo" /> {/* Added logo */}
      <div className="message-box">
        <h1>A place of warmth</h1>
      </div>
      <div className="signup-box">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <hr />
        <button onClick={handleGoogleSignIn} className="google-button">Sign Up with Google</button>
      </div>
    </div>
  );
};

export default SignUp;
