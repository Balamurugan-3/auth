import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
const navigate = useNavigate()
  const { userData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext)


  const handleLogout = async () => {

    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + "/api/auth/logout")
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(false)
        toast.success("successfully Logged out")
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }
    const handleEmailVerify = async()=>{
      try {
        axios.defaults.withCredentials = true
        const { data } = await axios.post(backendUrl + "/api/auth/email-verify-otp")
        if (data.success) {
          toast.success("successfully sended OTP to your email id")
          navigate("/email-verify")
        }
        else {
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }
    
  }
  return (
    <div className='flex justify-between items-center p-4 md:px-20 absolute top-0 w-full'>
      <div className='text-2xl text-purple-900'>
        Auth
      </div>

      {userData ?
        <div className='relative group'>
          <div className='w-10 h-10 text-center pt-1.5 font-semibold text-xl rounded-full bg-black text-white '>{userData.name[0].toUpperCase()}</div>
          <ul className='absolute bg-gray-100 right-2 p-2 rounded-md hidden group-hover:block'>

            {!userData.isAccountVerified && <li onClick={handleEmailVerify} className='hover:bg-gray-200 px-2  font-semibold text-purple-900'>Verify Email</li>
            }
            <li onClick={handleLogout} className='hover:bg-gray-200 px-2  font-semibold text-purple-900'>Logout</li>
          </ul>
        </div>
        :
        <div>
          <button className='py-1 px-6 border-2 rounded-full border-indigo-800' onClick={()=>navigate("/login")}>Login</button>
        </div>
      }

    </div>
  )
}

export default Navbar