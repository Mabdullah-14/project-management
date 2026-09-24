const express = require('express');
const router = express.Router();
const { 
    handleCreateColumn, 
    handleGetColumns, 
    handleUpdateColumn, 
    handleDeleteColumn ,
    handleReorderColumn,
    handleSearchColumn
} = require('../controller/columnController');
const {authMiddleware,roleMiddleware} = require('../middleware/authmiddleware');

router.post('/', authMiddleware,roleMiddleware('ADMIN','MEMBER'), handleCreateColumn);
router.put('/reorder',handleReorderColumn)
router.get('/search-column',authMiddleware,handleSearchColumn)
router.get('/board/:boardId', authMiddleware,roleMiddleware('ADMIN','MEMBER'), handleGetColumns);
router.patch('/:id', authMiddleware,roleMiddleware('ADMIN','MEMBER'), handleUpdateColumn);
router.delete('/:id', authMiddleware,roleMiddleware('ADMIN'), handleDeleteColumn);

module.exports = router;