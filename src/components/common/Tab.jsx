import React from 'react'

const Tab = ({tabData, accountType, setAccountType}) => {
  return (
    <div 
    style={{
          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }}
    className='flex lg:justify-self-start justify-self-center bg-richblack-800 py-1 px-1 gap-4 my-6 rounded-full [max-width:max-content]'>
        {
            tabData.map((tab) => (
                <button 
                key={tab.id}
                onClick={()=> setAccountType(tab.type)}
                className={`py-2 px-6 ${accountType === tab.type ? "text-richblack-5 bg-richblack-900 rounded-full"
                    : "text-richblack-200"}`}
                >
                    {tab.tabName}
                </button>
            ))
        }
      </div>
  )
}

export default Tab