import React, { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

const CardEditModal = ({ card, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [ets, setEts] = useState('')
  const [eta, setEta] = useState('')
  const [completionTime, setCompletionTime] = useState('')
  const [feedBack, setFeedBack] = useState('')

  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(null)
  const [cardVersion, setCardVersion] = useState(card?.version)

  // Helper to format Date objects to YYYY-MM-DD safely for HTML inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  // Refresh form states instantly when a new card is selected or opened
  useEffect(() => {
    if (card && isOpen) {
      setTitle(card.title || '')
      setDescription(card.description || '')
      setPriority(card.priority || 'Medium')
      setEts(card.ets || '')
      setEta(formatDateForInput(card.eta))
      setCompletionTime(formatDateForInput(card.completionTime))
      setFeedBack(card.feedBack || '')
      setCardVersion(card.version)
      setConflict(null)
    }
  }, [card, isOpen])

  if (!isOpen || !card) return null

  const handleClose = () => {
    setConflict(null)
    onClose()
  }

  // Gather current component state inputs into a single object payload
  const getPayload = (targetVersion) => ({
    title,
    description,
    version: targetVersion,
    priority,
    ets: ets ? parseInt(ets, 10) : null,
    eta: eta || null,
    completionTime: completionTime || null,
    feedBack: feedBack || null
  })

  // 1. Normal save attempt
  const handleSave = async () => {
  setSaving(true)
  
  const activeVersion = card.version !== undefined ? card.version : 1;
  
  const result = await onSave(card.id || card._id, getPayload(activeVersion))
  setSaving(false)

  if (result && result.success) {
    handleClose()
  } else if (result && result.conflict) {
    setConflict(result.conflict)
  } else {
    alert("Could not update card. Please make sure all details are correct.");
  }
}


  // 2. Force overwrite using newest server version tag to pass OCC
  const keepMine = async () => {
    setSaving(true)
    const result = await onSave(card.id || card._id, getPayload(conflict.version))
    setSaving(false)

    if (result.success) {
      setCardVersion(conflict.version)
      setConflict(null)
      handleClose()
    } else if (result.conflict) {
      setConflict(result.conflict)
    }
  }

  // 3. Keep server values and map directly to fields
  const takeTheirs = () => {
    setTitle(conflict.title || '')
    setDescription(conflict.description || '')
    setPriority(conflict.priority || 'Medium')
    setEts(conflict.ets || '')
    setEta(formatDateForInput(conflict.eta))
    setCompletionTime(formatDateForInput(conflict.completionTime))
    setFeedBack(conflict.feedBack || '')

    setCardVersion(conflict.version) // track new base version locally, without mutating the prop
    setConflict(null)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 relative select-none">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Edit Task</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Update all matching attributes for this board card.</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {conflict ? (
          // ---- CONFLICT RESOLUTION UI ----
          <div className="space-y-4">
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700 text-xs">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>This card has already been edited by someone else.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Your Changes</p>
                <p className="text-sm font-semibold text-slate-800 break-words">{title}</p>
                <p className="text-xs text-slate-500 mt-1 break-words">{description || 'No description'}</p>
                <p className="text-[11px] mt-2 text-slate-600"><strong>Priority:</strong> {priority}</p>
              </div>
              <div className="border border-amber-200 rounded-lg p-3 bg-amber-50/10">
                <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Server Version</p>
                <p className="text-sm font-semibold text-slate-800 break-words">{conflict.title}</p>
                <p className="text-xs text-slate-500 mt-1 break-words">{conflict.description || 'No description'}</p>
                <p className="text-[11px] mt-2 text-slate-600"><strong>Priority:</strong> {conflict.priority}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={takeTheirs}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Keep Server Version
              </button>
              <button
                onClick={keepMine}
                disabled={saving}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Keep My Changes'}
              </button>
            </div>
          </div>
        ) : (
          // ---- COMPLETE FORM WITH ALL FIELDS ----
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Grid System for extra options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                    ETS (Estimated Hours)
                  </label>
                  <input
                    type="number"
                    value={ets}
                    onChange={(e) => setEts(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                    ETA (Target Date)
                  </label>
                  <input
                    type="date"
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                    Completion Time
                  </label>
                  <input
                    type="date"
                    value={completionTime}
                    onChange={(e) => setCompletionTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Feedback
                </label>
                <input
                  type="text"
                  value={feedBack}
                  onChange={(e) => setFeedBack(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  placeholder="Add feedback context..."
                />
              </div>
            </div>

            {/* Form Action Footer */}
            <div className="flex gap-2 pt-5 mt-5 border-t border-slate-100">
              <button
                onClick={handleClose}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CardEditModal
