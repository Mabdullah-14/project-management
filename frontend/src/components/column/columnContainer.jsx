import React, { useState } from 'react'
import { MoreHorizontal, Plus, Trash2, Pencil } from 'lucide-react'
import { Draggable, Droppable } from '@hello-pangea/dnd' // ⚠️ FIXED: Drag and Drop libraries imported
import TaskCard from '../card/TaskCard'

const ColumnContainer = ({ 
  title, 
  color, 
  columnId, 
  allCards, 
  index, // ⚠️ FIXED: Added index prop passed from board.jsx for column movements
  userRole, 
  onPlusClick, 
  onEditCard, 
  onDeleteCard, 
  onEditColumn, 
  onDeleteColumn 
}) => {
  // Directly mapping pre-sorted nested arrays received from the core board wrapper
  const myCards = allCards || [];
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = (e) => {
    e.stopPropagation()
    setIsMenuOpen((prev) => !prev)
  }

  const handleAddCardClick = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onPlusClick(columnId)
  }

  const handleRenameClick = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onEditColumn({ id: columnId, title }) 
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onDeleteColumn({ id: columnId, title }) 
  }

  return (
    /* 
      1. COLUMN DRAGGABLE WRAPPER: Enclosing the entire column grid container box inside dnd context boundary 
    */
    <Draggable draggableId={columnId} index={index}>
      {(columnProvided) => (
        <div 
          ref={columnProvided.innerRef}
          {...columnProvided.draggableProps}
          style={{
            ...columnProvided.draggableProps.style // ⚠️ FIXED: Preserving native library motion styles
          }}
          className="w-[85vw] sm:w-[360px] md:w-96 min-w-[320px] sm:min-w-[360px] flex flex-col font-sans select-none shrink-0 bg-slate-100 border border-slate-300 shadow-sm p-4 rounded-2xl"
        >
          
          {/* Column Header (Acts as the unique handle grabber to drag column boxes) */}
          <div 
            {...columnProvided.dragHandleProps} // ⚠️ FIXED: Only header handles entire column movement actions
            className="flex items-center justify-between mb-4 px-1.5 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full ${color || 'bg-slate-400'} shrink-0`} />
              <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase truncate">
                {title}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/20 shrink-0">
                {myCards.length} {myCards.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>

            <div
              className="relative shrink-0"
              tabIndex={0}
              onBlur={() => setIsMenuOpen(false)}
              onClick={(e) => e.stopPropagation()} // Preventing menu clicks from triggering drag events
            >
              <button
                onClick={handleMenuToggle}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition cursor-pointer"
              >
                <MoreHorizontal size={15} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-6 z-10 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                  <button
                    onMouseDown={handleAddCardClick}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Plus size={13} /> Add Card
                  </button>

                  <button
                    onMouseDown={handleRenameClick}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Pencil size={13} /> Rename Column
                  </button>

                  {userRole === 'ADMIN' && (
                    <button
                      onMouseDown={handleDeleteClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={13} /> Delete Column
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 
            2. INNER CARDS DROPPABLE TRACKWAY: Target drop matrix zone where individual task cards are appended 
          */}
          <Droppable droppableId={columnId} type="card">
            {(cardProvided) => (
              <div 
                ref={cardProvided.innerRef}
                {...cardProvided.droppableProps}
                className="space-y-3 flex-1 overflow-y-auto min-h-[400px] sm:min-h-[600px] pr-1 custom-scrollbar"
              >
                {myCards.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-8 border border-dashed border-slate-200 rounded-xl">
                    No tasks yet
                  </div>
                ) : (
                  myCards.map((card, cardIndex) => (
                    <TaskCard 
                      key={card.id || card._id} 
                      card={card} 
                      index={cardIndex} // ⚠️ FIXED: Index must map to task cards elements inside Draggables
                      onEdit={onEditCard}
                      onDelete={onDeleteCard}
                    />
                  ))
                )}
                {cardProvided.placeholder} {/* ⚠️ FIXED: Crucial spacing placeholder token layout item */}
              </div>
            )}
          </Droppable>

        </div>
      )}
    </Draggable>
  )
}

export default ColumnContainer
