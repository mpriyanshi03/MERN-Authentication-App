import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/login';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerify';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/reset-password' element={<ResetPassword/>}></Route>
          <Route path='/email-verify' element={<EmailVerify/>}></Route>
        </Routes>
    </div>
  )
}

export default App;