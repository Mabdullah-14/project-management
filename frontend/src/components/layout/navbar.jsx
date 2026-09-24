import React from 'react'
import { Menu, Bell } from 'lucide-react'

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white border-b border-slate-200/80 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between w-full select-none font-sans gap-2 sm:gap-4 shrink-0">

      {/* Left Side */}
      <div className="flex items-center gap-2 min-w-0">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden shrink-0 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col leading-tight min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 tracking-tight truncate">
            BitrixMini Board
          </h1>
          <span className="hidden sm:block text-[11px] text-slate-400 font-medium truncate">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">

        {/* Live Sync */}
        <div className="hidden sm:flex items-center shrink-0">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"
            title="System Live Ready"
          />
          <span className="hidden lg:inline text-xs text-slate-400 font-semibold ml-1.5">
            Live Sync
          </span>
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200 shrink-0" />

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative shrink-0 p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

      </div>

    </nav>
  )
}

export default Navbar
