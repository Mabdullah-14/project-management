const express=require('express')
const router=express.Router()
const {handleCreateCard,handlegetCards,handledeleteCard,handleUpdateCard,handleReorderCard,handleSearchCard} =require('../controller/cardcontroller')
const {authMiddleware,roleMiddleware}=require('../middleware/authmiddleware')

router.post('/',authMiddleware,roleMiddleware('ADMIN','MEMBER'),handleCreateCard);
router.get('/',authMiddleware,roleMiddleware('ADMIN','MEMBER'),handlegetCards);
router.put('/reorder-cards',authMiddleware,handleReorderCard)
router.get('/search-card',authMiddleware,handleSearchCard)
router.patch('/:id',authMiddleware,roleMiddleware('ADMIN','MEMBER'),handleUpdateCard);
router.delete('/:id',authMiddleware,roleMiddleware('ADMIN'),handledeleteCard)

module.exports=router