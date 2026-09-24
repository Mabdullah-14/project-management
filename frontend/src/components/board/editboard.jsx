import React from 'react'
import { X } from 'lucide-react'

const EditModal = ({ isOpen, onClose, onSubmit, title, inputValue, setInputValue, placeholder, loading }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={() => !loading && onClose()} 
      />
      
      {/* Modal Card */}
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden relative z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-slate-800">{title || 'Edit Item'}</h2>
          <button 
            type="button"
            onClick={onClose} 
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-5 disabled:bg-slate-50"
            placeholder={placeholder || "Enter value..."}
            autoFocus
          />
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModal
