import React, { useContext } from 'react'
import welcome_svg from "../assets/welcome.svg"
import right_arrow from "../assets/right_arrow.svg"
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContext)
  return (
    <div className='flex flex-col justify-center items-center md:mt-16'>
        <img src={welcome_svg} alt="welcome" className='max-w-40' />
        <h1 className='mt-3 text-3xl '>Hello 
          <span className='text-purple-900 font-medium '> {userData?userData.name:"Developer"}</span></h1>
        <p className='mt-3 text-3xl font-bold'>Welcome To Our App</p>
        <p className='text-md mt-4 text-center'>This is a baisc Auth app using MERN stack </p>
        <button className='py-1 px-5 border rounded-full mt-3 md:mt-5 text-lg font-medium border-purple-600 flex justify-center items-center gap-2'>Get Start 
          <img src={right_arrow} alt="right arrow" className='w-8 mt-1' /></button>
    </div>
  )
}

export default Header