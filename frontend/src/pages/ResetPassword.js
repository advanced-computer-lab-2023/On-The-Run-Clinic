import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { username } = useParams();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:4000/resetPassword/${username}`, {
        otp,
        newPassword:password,
      });
      console.log(response);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <h4>Reset Password</h4>
      <br/>
      
      <br/>
      <input
        type="number"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <br/>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/>
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;