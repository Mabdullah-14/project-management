import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={() => !loading && onClose()} 
      />
      
      {/* Modal Card */}
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden relative z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-red-50 p-2 rounded-lg text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{title || 'Confirm Delete'}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition disabled:opacity-50 raw-btn cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
