const express=require('express')
const router=express.Router()
const {handleCreateBoard,handleGetBoard,handleUpdateBoard,handleDeleteBoard,handleGetBoardById,handleSearchBoard}  =require('../controller/boardcontroller')
const {authMiddleware, roleMiddleware}=require('../middleware/authmiddleware')

router.post('/',authMiddleware,roleMiddleware('ADMIN','MEMBER'),handleCreateBoard)
router.get('/',authMiddleware,roleMiddleware('ADMIN','MEMBER'),handleGetBoard)
router.get('/search-board',authMiddleware,handleSearchBoard)
router.get('/:id', authMiddleware,roleMiddleware('ADMIN','MEMBER'), handleGetBoardById)
router.patch('/:id',authMiddleware,roleMiddleware('ADMIN','MEMBER'),handleUpdateBoard)
router.delete('/:id',authMiddleware,roleMiddleware('ADMIN'),handleDeleteBoard)

module.exports=router