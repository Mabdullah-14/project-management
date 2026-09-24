import React from 'react'
import { useAuth } from '../../Context/authcontext'

const Blockscreen = () => {
  const {isBlocked,countDown,blockMessage}=useAuth()

if(!isBlocked) return null;


  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-900/95 backdrop-blur-md flex flex-col justify-center items-center z-[99999] text-white font-sans p-4 select-none">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-500 mb-3 tracking-tight">
          Wait a Minute!
        </h1>
        
        <p className="text-base text-slate-400 mb-6 leading-relaxed px-2">
          {blockMessage || 'You have sent too many requests. Please try again after a few minutes.'}
        </p>
<div className='text-5xl md:text-6xl font-black font-mono text-sky-400 bg-slate-950 px-6 py-4 rounded-xl inline-block shadow-inner border border-slate-900 tracking-wider'>
          00:{countDown < 10 ? `0${countDown}` : countDown}
        </div>
        <p className="text-xs text-slate-500 mt-6 border-t border-slate-700/50 pt-4">
          Security lock will automatically release when the timer hits zero.
        </p>  
      
    </div>
  )
}

export default Blockscreen
