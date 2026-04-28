import React from 'react'

function UserLoading() {
  return (
      <div className='space-y-3 px-2'>
          {
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='w-full px-4 py-2 bg-[#3c3c3c] animate-pulse flex gap-4 rounded-lg'>
                  <div className='w-12 h-12 rounded-full bg-gray-500 mb-2'></div> 
                    <div className='w-1/2 flex flex-col gap-2'>
                    <div className='w-full h-4 bg-gray-500 mb-1 rounded'></div>
                    <div className='w-3/4 h-4 bg-gray-500 rounded'></div>         
                  </div>
                      
                  </div>
              ))
              
          }
      
    </div>
  )
}

export default UserLoading
