import React from 'react'
import CTAButton from './Button'
import ColourText from './ColourText'
import { TypeAnimation } from 'react-type-animation'

const Codeblock = ({position, heading, subheading, ctabtn1, ctabtn2, codecolor, codeblock, gradientcolor}) => {
  return (
    <div className={`flex ${position} flex-col justify-between mt-12 gap-8`}>
        {/* Right part */}
        <div className='flex flex-col gap-4 py-6 lg:w-[50%] w-full'>
            <div className='lg:text-4xl text-2xl text-white font-bold font-inter'>{heading}</div>
            <div className='text-gray-400 lg font-inter'>{subheading}</div>
            <div className='flex flex-row gap-6'>
                <CTAButton active={ctabtn1.active} path={ctabtn1.path}>{ctabtn1.children}</CTAButton>
                <CTAButton active={ctabtn2.active} path={ctabtn2.path}>{ctabtn2.children}</CTAButton>
            </div>
        </div>
        {/* left part */}
        
        <div className='w-full lg:w-[500px] h-[356px] transform scale-100 md:scale-90 sm:scale-75 relative '>
            <div className={` absolute inset-0 ${gradientcolor} z-10` }></div>
            <div className='flex flex-row gap-2 p-8 border-2 inset-0 absolute z-20 '>
                <div className={`text-richblack-200 text-center font-inter`}>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p>12</p>
                </div>
                <div className={`${codecolor} flex shrink truncate`}>
                    <TypeAnimation
                        sequence={[codeblock, 1000, ""]}
                        cursor={true}
                        repeat={Infinity}
                        style={{
                        whiteSpace: "pre-line",
                        display: "block",
                        }}
                        omitDeletionAnimation={true}
                    />
                </div>
            </div>

        </div>
    </div>
  )
}

export default Codeblock