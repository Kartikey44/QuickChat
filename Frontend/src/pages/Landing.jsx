import React from 'react'
import Logo from '../assets/Logo.png'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate();

  return (
    <div className='w-full min-h-screen flex justify-center  relative items-center bg-[#3c4147]'>
      <img src={Logo} className="h-25 w-25 absolute top-7 left-7" />
      <div
        onClick={() => navigate('/login')}
        className='cursor-pointer text-center hover:scale-105 transition duration-200 text-xl rounded-xl text-[#ba36b1] shadow-xl px-20 py-3 bg-[#01132c]'
      >
        <p>Get started</p>
      </div>

    </div>
  )
}

export default Landing