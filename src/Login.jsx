// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import './common.css';
import Logo from './assets/images/logo.png';
import { SERVER_URL } from './constant';

const Login = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(SERVER_URL+'/api/participants/', { email });
      setStatus('success');
    } catch (error) {
      console.error('Error registering participant:', error);
      setStatus('error');
    }
  };

  const renderPopup = () => {
    if (status === 'success') {
      return <div className="popup success">Participant registered successfully.</div>;
    } else if (status === 'error') {
      return <div className="popup error">Error registering participant.</div>;
    }
    return null;
  };

  return (
    <div className="container">
      <img className="logo" src={Logo} alt="Logo" />
      <h1>Login</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {renderPopup()}
    </div>
  );
};

export default Login;
