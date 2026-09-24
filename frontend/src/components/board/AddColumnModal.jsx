import React, { useState } from 'react'

const AddColumnModal = ({ isOpen, onClose, onSubmit }) => {
  const [columnTitle, setColumnTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!columnTitle.trim()) return
    onSubmit(columnTitle.trim()) // Direct parent hook ko naam chala gaya
    setColumnTitle('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
      
      {/* Modal Box */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-2">Add New Column</h2>
        <p className="text-xs text-slate-400 mb-4">Create a custom lifecycle stage for your project workspace.</p>
        
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Column Title</label>
          <input
            type="text"
            required
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            placeholder="e.g., Code Review, QA Testing, Done"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Add Column
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddColumnModal
