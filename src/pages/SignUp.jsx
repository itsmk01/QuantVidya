import React from 'react'
import signupImg from '../assets/Images/signup.webp'
import Template from '../components/core/Auth/Template'

const SignUp = () => {
  return (
    <div className='w-11/12 max-w-[1260px] mx-auto'>
        <Template
        title="Join the millions learning to code with StudyNotion for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={signupImg}
        formType="signup"
        />
    </div>
  )
}

export default SignUp