import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerifyPage = () => {

  const {backendUrl,userData} = useContext(AppContext)

  const navigate = useNavigate()

  const inputRefs = React.useRef([])

  const handleOnInput = (e,index)=>{
    if(e.target.value.length>0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus()
    }
  }

  const handleKeyDown = (e,index)=>{
    if(e.key === "Backspace" && e.target.value=="" && index > 0){
        inputRefs.current[index-1].focus()
      }
    
  }


  const handlePasteOtp = (e)=>{
    const paste = e.clipboardData.getData("text")
    const pasteArray = paste.split("")
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char
      }
    });
  }


  const handleVerifyEmail = async(e)=>{
    e.preventDefault()
    const otpArray = inputRefs.current.map((e)=>e.value)
    const otp = otpArray.join("")
    try {
      const {data} = await axios.post(backendUrl+"/api/auth/email-verify",{otp})
      if(data.success){
        toast.success("Email Verified Successfully")
        navigate("/")
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.success(error.message)
    }
  }

  useEffect(()=>{
    userData.isAccountVerified && navigate("/")
  },[])
  
  return (
    <div className='min-h-screen flex justify-center items-center'>
        <form className='bg-slate-200 text-center p-7 '>
          <h1 className='text-2xl font-bold'>Email Verification</h1>
          <p className='my-4 text-sm text-indigo-900'>please enter your 6 digit otp </p>
          {Array(6).fill(0).map((_,index)=>(
            <input key={index} type="text" ref={(e)=>inputRefs.current[index]=e} maxLength={1}
             onInput={(e)=>handleOnInput(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)}
             onPaste={(e)=>handlePasteOtp(e,index)}
            className='w-12 h-12 border me-1 border-red-600 text-center text-xl outline-none'/>
        ))}
        <button className='mt-5 block w-full py-2 text-white font-semibold bg-gradient-to-r from-violet-400 to-violet-600'
        onClick={handleVerifyEmail}>Verify OTP</button>
        </form>
    </div>
  )
}

export default EmailVerifyPage;

// overleaf
