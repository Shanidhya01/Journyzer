import React from 'react'
import { suggestions } from '@/app/_components/Hero'

function EmptyBoxState({ onSelectOption }: any) {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-3xl text-center'>Start Planning <strong className='text-primary'>Your Trip Using AI</strong></h2>
      <p className='text-center text-gray-400 mt-2'>Discover the best destinations, plan your itinerary, and get personalized recommendations all powered by AI.</p>
      <div className='flex flex-col gap-5 mt-7'>
        {suggestions.map((suggestions, index) => (
          <div 
          key={index}
          onClick={()=>onSelectOption(suggestions.title)} 
          className='flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-border-primary hover:text-primary'>
            {suggestions.icon}
            <h2 className='text-xl'>{suggestions.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmptyBoxState