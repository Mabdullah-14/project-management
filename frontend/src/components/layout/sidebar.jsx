import React, { useState } from 'react'
import Profilepage from '../../pages/profilepage'
import {
  LayoutGrid,
  Search,
  History,
  Users,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useAuth } from '../../../Context/authcontext'

const Sidebar = ({ isMobile = false, onClose, onMembersClick, onTasksBoardClick, activeView = 'board' }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()

  const isCollapsed = isMobile ? false : collapsed

  return (
    <aside
      className={`
        h-screen
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-white border-r border-slate-200/80
        flex flex-col font-sans select-none shrink-0
        relative transition-all duration-300
      `}
    >

      {!isMobile && (
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="absolute -right-3 top-8 h-6 w-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition z-20 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronsRight size={13} />
          ) : (
            <ChevronsLeft size={13} />
          )}
        </button>
      )}

      {isMobile && (
        <button
          onClick={onClose}
          className="absolute right-3 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-20"
        >
          <X size={18} />
        </button>
      )}

      {/* Brand */}
      <div
        className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
          } px-4 pt-6 pb-5`}
      >
        <div className="flex items-center gap-2">

          <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            B
          </div>

          {!isCollapsed && (
            <span className="text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
              BitrixMini
            </span>
          )}

        </div>
      </div>

      {/* Project Selector */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="w-full flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700">
            <span className="truncate">
              Product Launch Q1
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">

        {!isCollapsed && (
          <p className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        )}

        <div className="flex flex-col gap-0.5">

          {/* Tasks Board — now driven by activeView, not hardcoded */}
          <div
            onClick={() => {
              onTasksBoardClick?.()
              if (isMobile) onClose?.()
            }}
            title={isCollapsed ? 'Tasks Board' : ''}
            className={`
              relative flex items-center
              ${isCollapsed ? 'justify-center' : 'gap-3'}
              rounded-lg px-3 py-2
              text-sm font-semibold
              border transition cursor-pointer
              ${activeView === 'board'
                ? 'text-indigo-600 bg-indigo-50 border-indigo-100/30'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-transparent'}
            `}
          >
            {!isCollapsed && activeView === 'board' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-indigo-600" />
            )}

            <LayoutGrid size={18} className="shrink-0" />

            {!isCollapsed && (
              <span className="whitespace-nowrap">
                Tasks Board
              </span>
            )}
          </div>

          {/* Search */}
          <div
            title={isCollapsed ? 'Search & Filter' : ''}
            className={`
              flex items-center
              ${isCollapsed ? 'justify-center' : 'gap-3'}
              rounded-lg px-3 py-2
              text-sm font-medium text-slate-500
              hover:bg-slate-50 hover:text-slate-700
              transition cursor-pointer
            `}
          >
            <Search size={18} className="shrink-0" />

            {!isCollapsed && (
              <span className="whitespace-nowrap">
                Search & Filter
              </span>
            )}
          </div>

          {/* History */}
          <div
            title={isCollapsed ? 'Audit History' : ''}
            className={`
              flex items-center
              ${isCollapsed ? 'justify-center' : 'gap-3'}
              rounded-lg px-3 py-2
              text-sm font-medium text-slate-500
              hover:bg-slate-50 hover:text-slate-700
              transition cursor-pointer
            `}
          >
            <History size={18} className="shrink-0" />

            {!isCollapsed && (
              <span className="whitespace-nowrap">
                Audit History
              </span>
            )}
          </div>

        </div>

        {!isCollapsed && user?.role === 'ADMIN' && (
          <p className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Admin Control
          </p>
        )}

        {/* Members — now driven by activeView too */}
        {user?.role === 'ADMIN' && (
          <div
            onClick={() => {
              onMembersClick?.()
              if (isMobile) onClose?.()
            }}
            title={isCollapsed ? 'Members' : ''}
            className={`
              relative flex items-center
              ${isCollapsed ? 'justify-center' : 'gap-3'}
              rounded-lg px-3 py-2
              text-sm font-medium
              border transition cursor-pointer
              ${activeView === 'members'
                ? 'text-indigo-600 bg-indigo-50 border-indigo-100/30'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-transparent'}
            `}
          >
            {!isCollapsed && activeView === 'members' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-indigo-600" />
            )}

            <Users size={18} className="shrink-0" />

            {!isCollapsed && (
              <span className="flex-1 flex items-center gap-1.5 whitespace-nowrap">
                Members
                <ShieldCheck size={12} className="text-indigo-400" />
              </span>
            )}
          </div>
        )}

      </nav>

      {/* Profile Footer: profile card, photo upload and logout live in the popup */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-100">
        <Profilepage isSidebarOpen={!isCollapsed} />
      </div>

    </aside>
  )
}

export default Sidebar
