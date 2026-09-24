import React, { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd' 

const TaskCard = ({ card, index, onEdit, onDelete }) => { 
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = (e) => {
    e.stopPropagation()
    setIsMenuOpen((prev) => !prev)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onEdit(card)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onDelete(card)
  }

  // 🔴 1. Dynamic Priority badging colors matrix mapping
  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-600 border-rose-100'
      case 'low':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100' // Medium
    }
  }

  // 📅 2. Format ETA date output cleanly (e.g., "17 Sep")
  const formatDueDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    })
  }

  // 🚨 3. Evaluation criteria for dynamic Overdue triggers
  const isOverdue = card.eta && new Date(card.eta) < new Date() && !card.completionTime

  return (
    <Draggable draggableId={card.id || card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps} 
          style={{
            ...provided.draggableProps.style 
          }}
          className="w-full bg-white border border-slate-200/80 p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 relative font-sans group cursor-grab active:cursor-grabbing select-none flex flex-col justify-between min-h-[120px]"
        >
          {/* Top Row: Title block and Menu contexts */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-1.5">
              <h4 className="font-bold text-slate-800 text-sm leading-snug tracking-tight min-w-0 break-words group-hover:text-blue-600 transition-colors">
                {card.title}
              </h4>

              {/* Menu Dropdown Container Wrapper */}
              <div
                className="relative shrink-0 z-20"
                tabIndex={0}
                onBlur={() => setIsMenuOpen(false)}
                onClick={(e) => e.stopPropagation()} 
              >
                <button
                  onClick={handleMenuToggle}
                  className="p-1 -m-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  <MoreHorizontal size={15} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-6 z-30 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-32">
                    <button
                      onMouseDown={handleEditClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onMouseDown={handleDeleteClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description Paragraph Container */}
            {card.description && (
              <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2 break-words">
                {card.description}
              </p>
            )}
          </div>

          {/* Dynamic properties display block layout metrics (Rebuilt to look high-end) */}
          <div className="mt-2 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold">
            
            {/* Left side markers metadata array loops */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Dynamic Priority Badge */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md border uppercase tracking-wider ${getPriorityStyles(card.priority)}`}>
                ● {card.priority || 'Medium'}
              </span>

              {/* Version Identifier Counter Indicator tag (OCC Proof) */}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md border bg-slate-50 text-slate-500 border-slate-200 font-semibold">
                v{card.version || 1}
              </span>
            </div>

            {/* Right side trackers metadata array loops */}
            <div className="flex items-center gap-2 font-semibold">
              {/* ETA / Due Date Tracking badge element */}
              {card.eta && (
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border ${isOverdue ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse font-bold' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {isOverdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                  <span>{formatDueDate(card.eta)}</span>
                </div>
              )}

              {/* ETS Story estimation points gauge element */}
              {card.ets && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md">
                  <Clock size={11} />
                  <span>{card.ets}h</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard
