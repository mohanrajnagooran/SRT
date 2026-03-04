import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../loginPage/authThunks";
import { useNavigate, Navigate } from "react-router-dom";
import "./LoginPage.css"; // Custom styles here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";
import { Package, Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { token } = useSelector((state) => state.auth);
  if (token) return <Navigate to="/" />;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-container">
        {/* Logo and Branding Section */}
        <div className="hero-branding">
          <div className="logo-wrapper">
            <div className="logo-glow"></div>
            <img
              src={logo}
              alt="SRT Parcel Delivery Logo"
              className="hero-logo"
            />
          </div>

          <div className="hero-text">
            <h1 className="hero-title">SRT Delivery</h1>
            <p className="hero-subtitle">
              Lightning-fast shipping solutions for your business
            </p>

            <div className="hero-stats">
              <div className="stat">
                <p className="stat-value">24/7</p>
                <p className="stat-label">Support</p>
              </div>

              <div className="divider"></div>

              <div className="stat">
                <p className="stat-value">100+</p>
                <p className="stat-label">Cities</p>
              </div>

              <div className="divider"></div>

              <div className="stat">
                <p className="stat-value">Fast</p>
                <p className="stat-label">Delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-wrapper">
          <div className="login-card">
            {/* Header */}
            <div className="login-header">
              <div className="icon-wrap">
                <img src={logo} alt="" width={80}/>
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">
                Sign in to access your delivery dashboard
              </p>
            </div>

            {/* Form */}
            <div className="login-body">
              <form onSubmit={handleLogin} className="login-form">
                {/* Email */}
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="form-options">
                  <label className="remember">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button type="submit" className="login-btn">
                  Login
                </button>
              </form>

              {/* Signup */}
              {/* <p className="signup-text">
                Don’t have an account?
                <a href="#"> Create Account</a>
              </p> */}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default LoginPage;
