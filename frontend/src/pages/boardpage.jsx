import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Sidebar from '../components/layout/sidebar'
import Navbar from '../components/layout/navbar'
import Board from '../components/board/board'
import { getBoard, updateBoard, deleteBoard, searchBoard } from '../services/board'
import CreateBoardModal from '../components/board/createBoardModal'
import ConfirmDeleteModal from '../components/board/deleteBoard'
import EditModal from '../components/board/editboard'
import { MoreHorizontal, Pencil, Trash2, Search, X } from 'lucide-react'
import { useAuth } from '../../Context/authcontext'
import { createUser } from '../services/auth'
import CreateUserModal from '../components/board/createusermodal'
import UserManagmentList from '../components/board/usermanagmentlist'

const Boardpage = () => {

  const { user } = useAuth()

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showUserManagement, setShowUserManagement] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const [boardToDelete, setBoardToDelete] = useState(null)
  const [boardToRename, setBoardToRename] = useState(null)
  const [newTitleInput, setNewTitleInput] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(6)

  const search = searchParams.get('search') || ''

  const handleSearch = (value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)

      if (value.trim()) {
        params.set('search', value)
      } else {
        params.delete('search')
      }

      return params
    })

    setCurrentPage(1)
  }

  const handleCreateUser = async (userData) => {
    return await createUser(userData)
  }

  const fetchBoardsList = (searchTerm, page = currentPage) => {
    setLoading(true)

    const request = searchTerm
      ? searchBoard(searchTerm)
      : getBoard(page, limit)

    request
      .then((data) => {

        if (searchTerm) {
          setBoards(data?.data || [])
        } else {
          setBoards(data?.boards || [])
          setCurrentPage(data?.currentPage || 1)
          setTotalPages(data?.totalPages || 1)
        }

        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBoardsList(search, currentPage)
  }, [search, currentPage])

  const handleMenuToggle = (e, boardId) => {
    e.stopPropagation()
    setOpenMenuId((prev) => (prev === boardId ? null : boardId))
  }

  const openRenameModal = (e, board) => {
    e.stopPropagation()
    setOpenMenuId(null)
    setBoardToRename(board)
    setNewTitleInput(board.title)
  }

  const handleRenameSubmit = async (e) => {
    e.preventDefault()

    if (!newTitleInput?.trim() || newTitleInput === boardToRename.title) {
      setBoardToRename(null)
      return
    }

    setIsActionLoading(true)

    try {
      await updateBoard(boardToRename.id, {
        title: newTitleInput.trim()
      })

      setBoardToRename(null)
      fetchBoardsList(search, currentPage)

    } catch (err) {
      console.error('Rename failed:', err)
    } finally {
      setIsActionLoading(false)
    }
  }

  const openDeleteConfirmation = (e, board) => {
    e.stopPropagation()
    setOpenMenuId(null)
    setBoardToDelete(board)
  }

  const handleDeleteConfirm = async () => {

    if (!boardToDelete) return

    setIsActionLoading(true)

    try {
      await deleteBoard(boardToDelete.id)

      setBoardToDelete(null)

      // Agar current page empty ho jaye to previous page par chale jao
      if (boards.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      } else {
        fetchBoardsList(search, currentPage)
      }

    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleTasksBoardClick = () => {
    setShowUserManagement(false)
    setSelectedBoardId(null)
  }

  const currentView = showUserManagement ? 'members' : 'board'

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-bold text-slate-500 bg-[#f4f7fa]">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-[#f4f7fa] font-sans flex overflow-hidden">

      <div className="hidden md:block shrink-0">
        <Sidebar
          onMembersClick={() => setShowUserManagement(true)}
          onTasksBoardClick={handleTasksBoardClick}
          activeView={currentView}
        />
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />

          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">

            <Sidebar
              isMobile={true}
              onClose={() => setIsMobileSidebarOpen(false)}
              onMembersClick={() => setShowUserManagement(true)}
              onTasksBoardClick={handleTasksBoardClick}
              activeView={currentView}
            />

          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {showUserManagement ? (

            <UserManagmentList
              onBackClick={() => setShowUserManagement(false)}
            />

          ) : selectedBoardId ? (

            <div className="h-full flex flex-col">

              <button
                onClick={() => setSelectedBoardId(null)}
                className="mb-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 self-start cursor-pointer"
              >
                ← Back to Dashboard
              </button>

              <Board boardId={selectedBoardId} />

            </div>

          ) : (

            <div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

                <h1 className="text-xl font-bold text-slate-800 shrink-0">
                  My Dashboard Boards
                </h1>

                <div className="relative flex-1 sm:max-w-xs">

                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search boards by title..."
                    className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />

                  {search && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}

                </div>

                <div className="flex gap-2 shrink-0">

                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => setIsUserModalOpen(true)}
                      className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      👤 Manage Members
                    </button>
                  )}

                  {(user?.role === 'ADMIN' || user?.role === 'MEMBER') && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      + Create Board
                    </button>
                  )}

                </div>

              </div>

              {boards.length === 0 ? (

                <div className="w-full bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[200px]">

                  <p className="text-slate-500 text-sm font-medium mb-4">
                    {search
                      ? `No boards found matching "${search}".`
                      : 'No boards found. Please create one to manage your workflow.'
                    }
                  </p>

                  {!search && (user?.role === 'ADMIN' || user?.role === 'MEMBER') && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      + Create Your First Board
                    </button>
                  )}

                </div>

              ) : (

                <>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

                    {boards.map((b) => (

                      <div
                        key={b.id}
                        onClick={() => setSelectedBoardId(b.id)}
                        className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all border-t-4 border-t-blue-500 relative flex flex-col justify-between min-h-[180px]"
                      >

                        <div className="flex items-start justify-between gap-4 mb-2">

                          <h3
                            className="font-bold text-slate-800 text-base truncate"
                            title={b.title}
                          >
                            {b.title}
                          </h3>

                          <div className="relative z-20">

                            <button
                              onClick={(e) => handleMenuToggle(e, b.id)}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <MoreHorizontal size={16} />
                            </button>

                            {openMenuId === b.id && (

                              <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs">

                                <button
                                  onClick={(e) => openRenameModal(e, b)}
                                  className="w-full px-3 py-2 text-left text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                                >
                                  <Pencil size={11} />
                                  Rename
                                </button>

                                {user?.role === 'ADMIN' && (
                                  <button
                                    onClick={(e) => openDeleteConfirmation(e, b)}
                                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                                  >
                                    <Trash2 size={11} />
                                    Delete
                                  </button>
                                )}

                              </div>
                            )}

                          </div>

                        </div>

                        <div className="space-y-1.5 my-3 text-xs text-slate-600 flex-1">

                          {b.projectBrief && (
                            <p className="text-slate-400 text-[11px] line-clamp-2 mb-2 leading-relaxed">
                              {b.projectBrief}
                            </p>
                          )}

                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400 w-16">
                              Category:
                            </span>

                            <span className="text-slate-700 font-medium">
                              {b.category || 'Development'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400 w-16">
                              Status:
                            </span>

                            <span className="text-slate-700 font-medium">
                              {b.status || 'Planning'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400 w-16">
                              Budget:
                            </span>

                            <span className="text-slate-700 font-medium">
                              {b.budgetHours ? `${b.budgetHours} Hours` : '10 Hours'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400 w-16">
                              Delivery:
                            </span>

                            <span className="text-slate-700 font-medium">
                              {b.targetDelivery
                                ? new Date(b.targetDelivery).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                                : 'No Deadline'
                              }
                            </span>
                          </div>

                        </div>

                        <div className="text-[10px] text-slate-400 text-right pt-2 border-t border-slate-100">
                          Created: {new Date(b.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>

                      </div>

                    ))}

                  </div>

                  {!search && totalPages > 1 && (

                    <div className="flex items-center justify-end gap-3 mt-6 ">

                      <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                        className=" cursor-pointer px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <span className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>

                    </div>

                  )}

                </>

              )}

            </div>

          )}

        </div>

      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(boardToDelete)}
        onClose={() => setBoardToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Board?"
        message={`Are you sure you want to delete "${boardToDelete?.title}"? This will permanently remove all associated columns and cards.`}
        loading={isActionLoading}
      />

      <EditModal
        isOpen={Boolean(boardToRename)}
        onClose={() => setBoardToRename(null)}
        onSubmit={handleRenameSubmit}
        title="Rename Board"
        inputValue={newTitleInput}
        setInputValue={setNewTitleInput}
        placeholder="Enter board title"
        loading={isActionLoading}
      />

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBoardCreated={() => fetchBoardsList(search, currentPage)}
      />

      <CreateUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onCreateUser={handleCreateUser}
      />

    </div>
  )
}

export default Boardpage