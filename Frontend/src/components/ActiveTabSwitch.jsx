import React from 'react'

function ActiveTabSwitch() {
  return (
    <div className='flex gap-5 text-white'>
      <span className='bg-[#191919] border border-white/10 rounded-full py-1 px-4'>All</span>
      <span className='bg-[#191919] border border-white/10 rounded-full py-1 px-4'>Unread</span>
    </div>
  )
}

export default ActiveTabSwitch
