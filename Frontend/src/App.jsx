import React, { useState } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import CrimeReport from './pages/CrimeReport'
import CrimeResponse from './pages/CrimeResponse'
import About from './pages/About'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Emergency from './pages/Emergency'
import CrimeMap from './pages/CrimeMap'
import AdminMessages from './pages/AdminMessages'
import Forgot_Password from './pages/Forgot_password'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ContactUs from './pages/ContactUs'

const App = () => {
  const [Token, setToken] = useState(localStorage.getItem('Token'));
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={Token ? <Home /> : <Navigate to="/login" replace />} />
          <Route path='/crime_report' element={Token ? <CrimeReport /> : <Navigate to="/login" replace />} />
          <Route path='/crime_response' element={Token ? <CrimeResponse /> : <Navigate to="/login" replace />} />
          <Route path='/contact_us' element={Token ? <ContactUs /> : <Navigate to="/login" replace />} />
          <Route path='/about_us' element={Token ? <About /> : <Navigate to="/login" replace />} />
          <Route path='/profile' element={Token ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path='/admin_messages' element={Token ? <AdminMessages /> : <Navigate to="/login" replace />} />
          <Route path='/notifications' element={Token ? <Notifications /> : <Navigate to="/login" replace />} />
          <Route path='/map' element={Token ? <CrimeMap /> : <Navigate to="/login" replace />} />
          <Route path='/emergency' element={<Emergency />} />
          <Route path='/register' element={!Token ? <Register /> : <Navigate to="/" replace />} />
          <Route path='/login' element={!Token ? <Login setToken={setToken} /> : <Navigate to="/" replace />} />
          <Route path='/forgot_password' element={<Forgot_Password />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;