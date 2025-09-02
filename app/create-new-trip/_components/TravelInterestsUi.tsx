import React from 'react'

export const TravelInterestsOptions = [
  { id: 1, title: 'Adventure', desc: 'Hiking, trekking, outdoors', icon: '🧗' },
  { id: 2, title: 'Sightseeing', desc: 'Landmarks & tours', icon: '🏛️' },
  { id: 3, title: 'Cultural', desc: 'History & local culture', icon: '🎭' },
  { id: 4, title: 'Food', desc: 'Local cuisine & dining', icon: '🍜' },
  { id: 5, title: 'Nightlife', desc: 'Bars & entertainment', icon: '🌃' },
  { id: 6, title: 'Relaxation', desc: 'Beaches & spas', icon: '🏖️' },
]

function TravelInterestsUi({ onSelectedOption } : any) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 items-center mt-1'>
      {TravelInterestsOptions.map((item) => (
        <div
          key={item.id}
          className='p-4 border rounded-2xl bg-white hover:border-primary cursor-pointer flex flex-col items-start gap-2'
          onClick={() => onSelectedOption(item.title)}
        >
          <div className='text-2xl'>{item.icon}</div>
          <h3 className='text-md font-semibold'>{item.title}</h3>
          <p className='text-sm text-gray-500'>{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default TravelInterestsUi
