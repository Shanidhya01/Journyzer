import React from 'react'

function FinalUi({ onSelectedOption, title, subtitle } : any) {
  return (
    <div className='w-full p-6 bg-white rounded-xl shadow-md border border-gray-100'>
      <div className='flex flex-col items-center gap-3'>
        <div className='text-4xl'>✨</div>
        <h3 className='text-lg font-semibold'>{title ?? 'Planning your dream trip...'}</h3>
        <p className='text-sm text-gray-500'>{subtitle ?? 'Gathering best destinations, activities, and travel details for you.'}</p>
        <button
          onClick={() => onSelectedOption('view')}
          className='mt-3 bg-orange-500 text-white px-4 py-2 rounded-full'
        >
          View Trip
        </button>
      </div>
    </div>
  )
}

export default FinalUi
