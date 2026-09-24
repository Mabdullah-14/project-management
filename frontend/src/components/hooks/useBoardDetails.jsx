import React, { useState, useEffect, useCallback } from 'react'
import { getBoardById } from '../../services/board'
import { createColumn,updateColumn,deleteColumn } from '../../services/column'

export const UseBoardDetails = (boardId) => {
  const [boardData, setBoardData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBoard = useCallback(async () => {
    if (!boardId) return
    try {
      setLoading(true)
      const data = await getBoardById(boardId)
      setBoardData(data)
    } catch (err) {
      console.log(err, 'Facing error during to fetching board metadata')
    } finally {
      setLoading(false)
    }
  }, [boardId])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  const addColumn = async (columnTitle) => {
    try {
      await createColumn({
        title: columnTitle,
        boardId: boardId,
        position: (boardData?.columns?.length || 0) + 1
      })
      await fetchBoard()
    } catch (err) {
      console.error(err)
    }
  }

  const editColumn=async(columnId,newTitle)=>{
    try{
        await updateColumn(columnId,{title:newTitle})
        await fetchBoard()
    }catch(err){
        console.log(err)
    }
  }
  const removeColumn=async(columnId)=>{
    try{
        await deleteColumn(columnId)
        await fetchBoard()

    }catch(err){
        console.log(err)
    }
  }

  return {
    boardData,
    loading,
    addColumn,
    editColumn,
    removeColumn,
    refreshBoard: fetchBoard
  }
}
