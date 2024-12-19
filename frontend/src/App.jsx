import React from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import EmailVerifyPage from './pages/EmailVerifyPage'
import {ToastContainer} from "react-toastify"
import { Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <>
    <ToastContainer/>
         <Navbar/>
      <Routes>
        <Route path='/' element={ <HomePage/>} />
        <Route path='/login' element={ <LoginPage/>} />
        <Route path='/email-verify' element={ <EmailVerifyPage/>} />
      </Routes>
    </>
  )
}

export default App