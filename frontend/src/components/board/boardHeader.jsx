import React from 'react'

const BoardHeader = ({ boardTitle, onAddColumnClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 md:px-8 py-4 bg-white border-b border-slate-200/80">
      <div className="shrink-0">
        <h2 className="text-xl font-bold text-slate-800">{boardTitle}</h2>
        <p className="text-xs text-slate-400">Manage your project workflow columns dynamically</p>
      </div>

      <button onClick={onAddColumnClick} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0">
        ➕ Add Column Layout
      </button>
    </div>
  )
}

export default BoardHeader