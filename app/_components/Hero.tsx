"use client";

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { ArrowDown, Globe2, Landmark, Plane, Send } from 'lucide-react';
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const suggestions=[
  {
    title:'Create New Trip',
    icon:<Globe2  className='text-blue-700 h-5 w-5'/>
  },
  {
    title:'Inspire me where to go',
    icon:<Plane  className='text-green-500 h-5 w-5'/>
  },
  {
    title:'Discover New Destinations',
    icon:<Landmark  className='text-orange-500 h-5 w-5'/>
  },
  {
    title:'Adventure Destinations',
    icon:<Globe2  className='text-yellow-600 h-5 w-5'/>
  },

]

function Hero() {

  const { user } = useUser();

  const router = useRouter();
  const onSend = () => {
    // Handle send action
    if(!user){
      router.push('/sign-in');
      return;
    }
    // Navigate to Create Trip
    router.push('/create-new-trip');
  };

  return (
    <div className='w-full mt-24 flex flex-col items-center'>
      {/* Content */}
      <div className='max-w-3xl w-full text-center space-y-6'>
        <h1 className='text-xl md:text-5xl font-bold'>Hey, I'm Journyzer your <span className='text-primary'>AI travel planner!</span></h1>
        <p className='text-lg'>Tell me what you need help with! and I'll handle the rest: Flights, Hotels, Restaurants, Attractions, and more all in just seconds</p>
      </div>

      {/* Input Box */}
      <div className='w-full flex justify-center mt-8 p-2'>
        <div className='border rounded-2xl p-4 w-full max-w-3xl relative'>
          <Textarea 
            placeholder='Create a trip for Jaipur from Bangalore' 
            className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none'
          />
          <Button size={'icon'} className='absolute bottom-6 right-6' onClick={()=>onSend()}>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Suggestion List */}
      <div className='flex gap-5'>
        {suggestions.map((suggestion, index) => (
          <div key={index} className='flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white'>
            {suggestion.icon}
            <h2 className='text-sm'>{suggestion.title}</h2>
          </div>
        ))}
      </div>

      <h2 className='my-7 mt-14 flex gap-2'>Not Sure Where to go? <strong>See how it works</strong><ArrowDown /></h2>
      {/* Video Section */}
      <HeroVideoDialog
        className="mx-auto w-[800px] max-w-full aspect-[21/9] rounded-2xl shadow-xl"
        animationStyle="from-center"
        videoSrc="main.mp4"
        thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
        thumbnailAlt="Dummy Video Thumbnail"
      />
    </div>
  )
}

export default Hero