import { useState } from "react";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/Home";
import AuthPage from "./pages/Auth/AuthPage";
import { useAuthentication } from "./api/auth";
import ProfilePage from "./components/Profile/ProfilePage";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";
import PostList from "./pages/Posts/PostListPage";
import PostDetail from "./pages/Posts/PostDetails";

function App() {
  const { isAuthorized } = useAuthentication();
  const ProtectedLogin = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <AuthPage initialMethod="login" />
    );
  };
  const ProtectedRegister = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <AuthPage initialMethod="register" />
    );
  };

  return (
    <div className="home">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/edit" element={<ProfileEditPage />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/" element={<Home />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
