import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import axios from "axios"

import user_img from "../assets/user_img.svg"
import email_img from "../assets/email_img.svg"
import password_img from "../assets/password_img.svg"

//context 
import { AppContext } from '../context/AppContext'


const LoginPage = () => {

  const navigate = useNavigate()
  //context
  const { backendUrl ,setIsLoggedIn ,getUserData } = useContext(AppContext)

  //state login or sign up
  const [state, setState] = useState("Sign Up")

  useEffect(()=>{
    setName("")
    setEmail("")
    setPassword("")
  },[state])

  //state inputs
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //handle state data
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    //sign up method
    if (state === "Sign Up") {

      if(!name || !email || !password){
        return toast.error("input values Required")
      }
      const user = {
        name,email,password
      }
      axios.defaults.withCredentials=true
      const res = await axios.post(backendUrl + "/api/auth/register", user,
        {
          headers:{
             "Content-Type": "application/json"
          }
        }
      )
      const data =await res.data
      if (res.status === 201) {
        toast.success("New User Account Created Successfully")
        setIsLoggedIn(true)
         await getUserData()
        navigate("/")
        console.log("after the navigate")
        setName("")
        setEmail("")
        setPassword("")
      }
      else {
        toast.error(data.message)
      }
    }
    //login method
    else {
      if( !email || !password){
        return toast.error("input values Required")
      }
      axios.defaults.withCredentials=true
      const res = await axios.post(backendUrl + "/api/auth/login", {email, password })
      const data = await res.data
      if (res.status === 200) {
        toast.success("User Login Successfully")
        setIsLoggedIn(true)
        await getUserData()
        navigate("/")
        console.log("after the navigate")
        setEmail("")
        setPassword("")
      }
      else {
        toast.error(data.message)
      }
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center mx-auto p-3 '>
      <form className='p-5 md:p-6 max-w-96 h-auto w-full  bg-slate-50 text-center shadow-xl rounded-sm' onSubmit={handleSubmit}>

        <h2 className='text-purple-700 font-bold text-3xl'>{state}</h2>
        <p className='text-md text-purple-500 mt-4'>{state === "Sign Up" ? "Create Your Account" : "Login Your Account"}</p>

        <div className='mt-4'>

          {state === "Sign Up" &&
            <div className='flex items-center border-b border-b-purple-800 mb-4 md:py-1 md:px-2'>
              <img src={user_img} alt="" className='w-6' />
              <input type="text" placeholder='Name' name='name' className='text-sm w-full rounded-sm bg-transparent p-1 md:p-2 outline-none'
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          }


          <div className='flex items-center border-b border-b-purple-800 mb-4 md:py-1 md:px-2'>
            <img src={email_img} alt="" className='w-6' />
            <input type="email" placeholder='Email' name='email' className='text-sm w-full rounded-sm bg-transparent p-1 md:p-2 outline-none'
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className='flex items-center border-b border-b-purple-800 mb-4 md:py-1 md:px-2'>
            <img src={password_img} alt="" className='w-6' />
            <input type="password" placeholder='Password' name='password' className='text-sm w-full rounded-sm bg-transparent p-1 md:p-2 outline-none'
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        {state === "Sign Up" ?
          <button type='submit' className='w-full bg-gradient-to-r from-indigo-200 to-indigo-500 font-bold py-2 rounded-sm cursor-pointer'
        >
            Create Account
          </button>
          :
          <button type='submit' className='w-full bg-gradient-to-r from-indigo-200 to-indigo-500 font-bold py-2 rounded-sm cursor-pointer'>Login</button>
        }
        {state === "Login" &&
          <Link className='text-sm text-right mt-1 block text-violet-900'>Forgot Password ?</Link>
        }
        {state === "Sign Up" ?
          <p className='mt-4 text-sm '>Already have an account <span className='text-violet-900 underline cursor-pointer'
            onClick={() => setState("Login")}>Login here</span></p>
          :
          <p className='mt-4 text-sm '>Create an account <span className=' text-violet-900 underline cursor-pointer'
            onClick={() => setState("Sign Up")}>Signup here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPage