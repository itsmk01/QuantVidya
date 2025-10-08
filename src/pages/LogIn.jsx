import React from 'react'
import loginImg from '../assets/Images/login.webp'
import Template from '../components/core/Auth/Template'

const LogIn = () => {
  return (
    <div className='w-11/12 max-w-[1260px] mx-auto'>
        <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={loginImg}
        formType="login"
        />
    </div>
  )
}

export default LogIn