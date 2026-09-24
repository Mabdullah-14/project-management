import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import ColumnContainer from '../column/columnContainer'
import AddTaskModal from '../card/Addtaskmodal'
import CardEditModal from '../card/editcardmodal'
import BoardHeader from './BoardHeader'
import AddColumnModal from './AddColumnModal'

import { getBoardById } from '../../services/board'
import { reorderCard } from '../../services/card'
import { reorderColumn } from '../../services/column'
import { useCards } from '../hooks/useCard'
import { UseBoardDetails } from '../hooks/useBoardDetails'

const Board = ({ boardId }) => {

  const { addCard, editCard, removeCard } = useCards()
  const { boardData, loading: boardLoading, addColumn, editColumn, removeColumn } = UseBoardDetails(boardId)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)

  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadColumns = async () => {
      setLoading(true)

      try {
        const data = await getBoardById(boardId)
        setColumns(data?.columns || [])
      } catch (err) {
        console.error('Error loading board:', err)
      } finally {
        setLoading(false)
      }
    }

    if (boardId) loadColumns()
  }, [boardId])

  const handleOpenModal = (columnId) => {
    setSelectedColumnId(columnId)
    setIsModalOpen(true)
  }

  const handleCreateTask = async (taskData) => {
    try {
      const targetColumn = columns.find(col => col.id === selectedColumnId)
      const nextPosition = targetColumn?.cards?.length || 0

      const savedCard = await addCard({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        ets: taskData.ets,
        eta: taskData.eta,
        columnId: selectedColumnId,
        position: nextPosition,
        version: 1
      })

      if (savedCard) {
        setColumns(prevColumns => prevColumns.map(col => col.id === selectedColumnId ? { ...col, cards: [...(col.cards || []), savedCard] } : col))
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const handleCardClick = (card) => {
    setSelectedCard(card)
    setIsEditOpen(true)
  }

  const handleEditClose = () => {
    setIsEditOpen(false)
    setSelectedCard(null)
  }

  const handleUpdateCard = async (cardId, updatedFields) => {
    if (!selectedCard) return { success: false }

    try {
      const result = await editCard(cardId || selectedCard.id || selectedCard._id, updatedFields)

      if (result?.success) {
        handleEditClose()
      }

      return result
    } catch (err) {
      console.error('Card update failed:', err)
      return { success: false }
    }
  }

  const handleDeleteCard = async (card) => {
    try {
      await removeCard(card.id || card._id)

      if (selectedCard && (selectedCard.id || selectedCard._id) === (card.id || card._id)) {
        handleEditClose()
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleEditColumn = async (column) => {
    const newTitle = window.prompt('Naya column title likhein:', column.title)

    if (!newTitle || !newTitle.trim() || newTitle === column.title) return

    try {
      await editColumn(column.id, newTitle)
    } catch (err) {
      console.error('Column rename failed:', err)
    }
  }

  const handleDeleteColumn = async (column) => {
    try {
      await removeColumn(column.id)
    } catch (err) {
      console.error('Column delete failed:', err)
    }
  }

  const onDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (type === 'column') {
      const updatedColumns = [...columns]
      const [movedColumn] = updatedColumns.splice(source.index, 1)

      updatedColumns.splice(destination.index, 0, movedColumn)
      setColumns(updatedColumns)

      try {
        await reorderColumn({
          columnId: draggableId,
          boardId,
          sourceIndex: source.index,
          destIndex: destination.index
        })
      } catch (err) {
        console.error('Column reorder failed:', err)
      }

      return
    }

    const sourceColIdx = columns.findIndex(col => col.id === source.droppableId)
    const destColIdx = columns.findIndex(col => col.id === destination.droppableId)

    if (sourceColIdx === -1 || destColIdx === -1) return

    const sourceColumn = columns[sourceColIdx]
    const destColumn = columns[destColIdx]

    const sourceCards = [...(sourceColumn.cards || [])]
    const destCards = [...(destColumn.cards || [])]

    const [movedCard] = sourceCards.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      sourceCards.splice(destination.index, 0, movedCard)

      const nextState = [...columns]
      nextState[sourceColIdx] = { ...sourceColumn, cards: sourceCards }

      setColumns(nextState)
    } else {
      destCards.splice(destination.index, 0, movedCard)

      const nextState = [...columns]
      nextState[sourceColIdx] = { ...sourceColumn, cards: sourceCards }
      nextState[destColIdx] = { ...destColumn, cards: destCards }

      setColumns(nextState)
    }

    try {
      await reorderCard({
        cardId: draggableId,
        sourceColId: source.droppableId,
        destColId: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index
      })
    } catch (err) {
      console.error('Card reorder failed:', err)
    }
  }

  if (loading || boardLoading) {
    return <div className="flex-1 flex items-center justify-center text-slate-500 font-bold text-sm bg-[#f8fafc]/50 min-h-screen">Loading...</div>
  }

  if (!boardData) {
    return <div className="p-8 text-center text-red-500 font-medium">Board data not found.</div>
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 font-sans select-none">
      <BoardHeader boardTitle={boardData.title} onAddColumnClick={() => setIsColumnModalOpen(true)} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board-swimlanes" direction="horizontal" type="column">
          {(provided) => (
            <main ref={provided.innerRef} {...provided.droppableProps} className="flex-1 min-w-0 min-h-0 overflow-x-auto overflow-y-auto p-3 sm:p-4 md:p-8 flex items-start gap-3 sm:gap-4 md:gap-6 bg-slate-200/70 custom-scrollbar">
              {columns.map((col, index) => (
                <ColumnContainer
                  key={col.id}
                  title={col.title}
                  columnId={col.id}
                  index={index}
                  allCards={col.cards || []}
                  onPlusClick={handleOpenModal}
                  onCardClick={handleCardClick}
                  onDeleteCard={handleDeleteCard}
                  onEditCard={handleCardClick}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                />
              ))}

              {provided.placeholder}
            </main>
          )}
        </Droppable>
      </DragDropContext>

      <AddColumnModal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} onSubmit={addColumn} />

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateTask} />

      <CardEditModal isOpen={isEditOpen} card={selectedCard} onClose={handleEditClose} onSave={handleUpdateCard} onDelete={() => selectedCard && handleDeleteCard(selectedCard)} />
    </div>
  )
}

export default Board