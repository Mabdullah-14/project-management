const { createBoard, getBoards, updateBoards, deleteBoard, getBoardById, searchBoard } = require('../services/boardservices')

const handleCreateBoard = async (req, res) => {
    try {
        const { title, projectBrief, status, category, budgetHours, targetDelivery } = req.body

        if (!title) {
            return res.status(400).json({ message: "Board title is required!" })
        }

        const userId = req.user?.id

        const board = await createBoard(title, userId, {
            projectBrief,
            status,
            category,
            budgetHours,
            targetDelivery
        })

        return res.status(201).json({
            message: "Board created successfully!",
            data: board
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const handleGetBoard = async (req, res) => {
    try {
        const userId = req.user?.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 6

        const result = await getBoards(userId, page, limit)

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const handleUpdateBoard = async (req, res) => {
    try {
        const { id } = req.params
        const { title } = req.body

        if (!title) {
            return res.status(400).json({
                message: "New title is required for update!"
            })
        }

        const updated = await updateBoards(id, title)

        return res.status(200).json({
            message: "Board updated successfully!",
            data: updated
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const handleDeleteBoard = async (req, res) => {
    try {
        const { id } = req.params

        await deleteBoard(id)

        return res.status(200).json({
            message: "Board deleted successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const handleGetBoardById = async (req, res) => {
    try {
        const { id } = req.params

        const board = await getBoardById(id)

        if (!board) {
            return res.status(404).json({
                message: "Board not found!"
            })
        }

        return res.status(200).json(board)
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const handleSearchBoard = async (req, res) => {
    try {
        const { search } = req.query

        let whereCondition = {}

        if (search) {
            whereCondition.title = {
                contains: search,
                mode: 'insensitive'
            }
        }

        const results = await searchBoard(whereCondition)

        return res.status(200).json({
            success: true,
            data: results
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error searching boards',
            error: error.message
        })
    }
}

module.exports = {
    handleCreateBoard,
    handleGetBoard,
    handleUpdateBoard,
    handleDeleteBoard,
    handleGetBoardById,
    handleSearchBoard
}