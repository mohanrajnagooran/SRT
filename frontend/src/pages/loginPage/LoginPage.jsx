// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../loginPage/authThunks';
import { useNavigate, Navigate } from 'react-router-dom';
import './LoginPage.css'; // Custom styles here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png'

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { token } = useSelector((state) => state.auth);
  if (token) return <Navigate to="/" />;

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    navigate('/');
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="login-container">
      
      <div className="login-box">
        <img src={logo} alt="" width={120}/>
        <h2 className="text-orange mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input
              type="email"
              className="form-control custom-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Password</label>
        <div className='position-relative'>     
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control custom-input pe-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="input-icon-eye"
              onClick={() => setShowPassword((prev) => !prev)}
            >
               <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            </div>
          </div>
          <button className="btn btn-orange w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
