import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN } from "./token";

export const useAuthentication = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userId, setUserId] = useState(null); // Store user ID

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

      console.log("ACCESS_TOKEN", token);
      console.log("GOOGLE_ACCESS_TOKEN", googleAccessToken);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.user_id); // Extract user ID from token
          console.log("User ID from token:", decoded.user_id);

          const tokenExpiration = decoded.exp;
          const now = Date.now() / 1000;

          if (tokenExpiration < now) {
            await refreshToken();
          } else {
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsAuthorized(false);
        }
      } else if (googleAccessToken) {
        const isGoogleTokenValid = await validateGoogleToken(googleAccessToken);
        if (isGoogleTokenValid) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    };
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      setIsAuthorized(false);
    }
  };

  const validateGoogleToken = async (googleAccessToken) => {
    try {
      const res = await api.post("/api/google/validate_token/", {
        access_token: googleAccessToken,
      });
      return res.data.valid;
    } catch (error) {
      console.error("Error validating Google token", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
    setIsAuthorized(false);
    setUserId(null);
    window.location.reload();
  };

  return { isAuthorized, userId, logout };
};
