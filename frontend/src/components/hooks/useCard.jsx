import { useState } from 'react'
import { createCard, updateCard, deleteCard } from '../../services/card'

export const useCards = () => {
  const [cards, setCards] = useState([])

  const addCard = async (cardData) => {
    const result = await createCard(cardData)
    const actualSavedCard = result?.data || result

    setCards(prev => [...prev, actualSavedCard])

    return actualSavedCard
  }

  const editCard = async (id, cardData) => {
    try {
      const response = await updateCard(id, cardData)
      const updated = response?.data?.data || response

      setCards(prev => prev.map(c => c.id === id ? updated : c))

      return { success: true }
    } catch (err) {
      if (err.response?.status === 409) {
        return { success: false, conflict: err.response.data.currentServerState }
      }

      console.error('Server update failed:', err.response?.data?.message || err.message)

      return { success: false, error: true }
    }
  }

  const removeCard = async (id) => {
    await deleteCard(id)
    setCards(prev => prev.filter(c => (c.id || c._id) !== id))
  }

  return { cards, addCard, editCard, removeCard }
}