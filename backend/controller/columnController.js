const { 
    createCoulumn, 
    getCoulumnsByBoard, 
    updateCoulumn, 
    deleteCoulumn,
    reorderColumnService ,
    searchColumn
} = require('../services/columnservices');

// 1. CREATE COLUMN
const handleCreateColumn = async (req, res) => {
    try {
        const { title, position, boardId } = req.body;
        if (!title || !boardId) {
            return res.status(400).json({ message: "Title and Board ID are required!" });
        }

        const column = await createCoulumn(title, position, boardId);
        return res.status(201).json({ message: "Column created successfully!", data: column });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. GET COLUMNS BY BOARD ID
const handleGetColumns = async (req, res) => {
    try {
        const { boardId } = req.params;
        const columns = await getCoulumnsByBoard(boardId);
        return res.status(200).json(columns);
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 3. UPDATE COLUMN
const handleUpdateColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, position } = req.body;

        const updated = await updateCoulumn(id, title, position);  
        return res.status(200).json({ message: "Column updated successfully!", data: updated });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 4. DELETE COLUMN
const handleDeleteColumn = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCoulumn(id);
        return res.status(200).json({ message: "Column deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 5.hanlerecord record column

const handleReorderColumn=async(req,res)=>{
    try{
   
         const { columnId, boardId, sourceIndex, destIndex } = req.body;

          if (!columnId || !boardId || sourceIndex === undefined || destIndex === undefined) {
            return res.status(400).json({ message: "Missing required fields for column reordering!" });
        }
        if (parseInt(sourceIndex) === parseInt(destIndex)) {
            return res.status(200).json({ message: "Column position unchanged." });
        }
        const updatedColumn = await reorderColumnService(columnId, boardId, sourceIndex, destIndex);
        return res.status(200).json({ 
            message: "Column order updated successfully in database!", 
            data: updatedColumn 
        });
    }catch(error){
         return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
const handleSearchColumn=async(req,res)=>{
    try{
        const { search, boardId } = req.query;
        let whereCondition = {};
        if (boardId) {
            whereCondition.boardId = boardId;   
        }
        if (search) {
            whereCondition.title = {
                contains: search,
                mode: 'insensitive'
            };
        }
        const results = await searchColumn(whereCondition);
        return res.status(200).json({ success: true, data: results });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error searching columns',
            error: error.message
        });
    }
}

module.exports = {
    handleCreateColumn,
    handleGetColumns,
    handleUpdateColumn,
    handleDeleteColumn,
    handleReorderColumn,
    handleSearchColumn
};