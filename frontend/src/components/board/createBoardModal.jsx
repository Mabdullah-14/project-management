import React, { useState } from 'react'
import { createBoard } from '../../services/board'

const CreateBoardModal = ({ isOpen, onClose, onBoardCreated }) => {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [projectBrief, setProjectBrief] = useState('')
  const [status, setStatus] = useState('Planning')
  const [category, setCategory] = useState('Development')
  const [budgetHours, setBudgetHours] = useState('')
  const [targetDelivery, setTargetDelivery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await createBoard({
        title,
        projectBrief,
        status,
        category,
        budgetHours: budgetHours || 10,
        targetDelivery: targetDelivery || null
      })
      setTitle('')
      setProjectBrief('')
      setStatus('Planning')
      setCategory('Development')
      setBudgetHours('')
      setTargetDelivery('')

      onBoardCreated()
      onClose()
    } catch (err) {
      console.error("Error creating board from modal:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />

      {/* Modal Card Structure */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative z-10 animate-in fade-in zoom-in-95 duration-150 border border-slate-200"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-2">Create New Board</h2>
        <p className="text-xs text-slate-400 mb-4">Give your workspace project a clear title to get started.</p>

        {/* 1. Board Title */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Board Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Mobile App Build, Marketing Sprint"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* 2. Project Brief / Description */}
        <div className='mb-3'>
          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Project Brief / Scope</label>
          <textarea 
            value={projectBrief}
            onChange={(e) => setProjectBrief(e.target.value)}
            placeholder="High-level vision, scope or summary of this workspace..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          ></textarea> 
        </div>

        {/* 3. Grid Row: Category & Status */}
        <div className='grid grid-cols-2 gap-3 mb-3'>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer text-slate-700 font-medium"
            >
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer text-slate-700 font-medium"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* 4. Grid Row: Budget & Delivery Target */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div>
             <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Budget (Hours)</label>
             <input 
               type="number"
               min="0"
               value={budgetHours}
               onChange={(e) => setBudgetHours(e.target.value)}
               placeholder='e.g., 40'
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
             />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Target Delivery</label>
            <input
              type="date"
              value={targetDelivery}
              onChange={(e) => setTargetDelivery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer text-slate-700 font-medium"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBoardModal
