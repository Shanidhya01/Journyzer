import React from 'react'
import ChatBot from './_components/ChatBox'

function CreateNewTrip() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-10'>
      <div>
        <ChatBot />
      </div>
      <div>
        Map and Trip to Display
      </div>
    </div>
  )
}

export default CreateNewTrip