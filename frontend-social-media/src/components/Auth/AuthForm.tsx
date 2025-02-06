import api from "../../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../api/token";
import "../../styles/AuthForm.css";
import google from "../../assets/google.png";
import React from "react";

interface AuthFormProps {
  route: string;
  method: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ route, method }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access ?? "");
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh ?? "");
        navigate("/");
        window.location.reload();
      } else {
        setSuccess("Registration successful. Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid credentials");
        } else if (error.response.status === 400) {
          setError("Username already exists");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/accounts/google/login/";
  };

  return (
    <div className="form-container">
      {loading && (
        <div className="loading-indicator">
          {error ? (
            <span className="error-message">{error}</span>
          ) : (
            <div className="spinner"></div>
          )}
        </div>
      )}
      {!loading && (
        <form onSubmit={handleSubmit} className="form">
          <h2>{method === "register" ? "Register" : "Login"}</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-button">
            {method === "register" ? "Register" : "Login"}
          </button>
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
          >
            <img src={google} alt="Google icon" className="google-icon" />
            {method === "register"
              ? "Register with Google"
              : "Login with Google"}
          </button>
          {method === "login" && (
            <p className="toggle-text">
              Don't have an account?{" "}
              <span
                className="toggle-link"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          )}
          {method === "register" && (
            <p className="toggle-text">
              Already have an account?{" "}
              <span className="toggle-link" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default AuthForm;
