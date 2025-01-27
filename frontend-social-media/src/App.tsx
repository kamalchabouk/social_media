import { useState } from "react";
import React from "react";
import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import { useAuthentication } from "./auth";


function App() {


  const {isAuthorized} = useAuthentication()
const ProtectedLogin = () => {
  return isAuthorized ? <Navigate to='/' /> :<AuthPage initialMethod="login" />
}
const ProtectedRegister = () => {
  return isAuthorized ? <Navigate to='/' /> :<AuthPage initialMethod="register" />
}

  return(
<div>
  <BrowserRouter>
  <Navbar />
  <Routes>
    <Route path="/login" element={<ProtectedLogin />} />
    <Route path="/register" element={<ProtectedRegister />} />
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
</div>
  )
}

export default App;