import React, { useState } from 'react'
// 💡 FIXED: Added 'Calendar' icon import here to stop crash
import { X, AlertCircle, Clock, Calendar } from 'lucide-react'

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [ets, setEts] = useState('')
  const [eta, setEta] = useState('')

  // 💡 FIXED: Cleaned up the double 'if (!isOpen)' checks to just one
  if (!isOpen) return null

  const handleSubmit = () => {
    if (!title.trim()) return 

    onSubmit({ 
      title: title.trim(),
      description: description.trim() || null,
      priority,
      ets: ets ? parseInt(ets, 10) : null,
      eta: eta || null
    })

    // States Clean Resetting
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setEts('')
    setEta('')
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setEts('')
    setEta('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 relative select-none animate-in fade-in zoom-in-95 duration-150">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Create New Task</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Add a new item to your active workspace.</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Main Inputs fields container */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide engineering notes or details regarding this card..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-400 resize-none"
            />
          </div>

          {/* 💡 FIXED: Changed to 'grid-cols-3' so Priority, ETS, and ETA align perfectly in one smooth line */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {/* Priority Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
              <div className='relative'>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <AlertCircle size={12} />
                </div>
              </div>
            </div>

            {/* Estimation Hours input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ETS (Hours)</label>
              <div className='relative'>
                <input 
                  type="number" 
                  min="1"
                  value={ets}
                  onChange={(e) => setEts(e.target.value)}
                  placeholder='e.g., 4'
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <Clock size={12} />
                </div>
              </div>
            </div>

            {/* Target Deadline Picker */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Task Deadline (ETA)</label>
              <div className="relative">
                <input
                  type="date"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <Calendar size={12} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Controls Actions Buttons Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
          <button onClick={handleClose} className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-xs transition cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm shadow-indigo-600/10 transition cursor-pointer">
            Create Task
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddTaskModal
