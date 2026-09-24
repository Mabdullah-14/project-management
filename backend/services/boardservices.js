const { prisma } = require('../config/db')

const createBoard = async (title, userId, extraData = {}) => {
    const { projectBrief, status, category, budgetHours, targetDelivery } = extraData

    return await prisma.board.create({
        data: {
            title,
            userId,
            projectBrief: projectBrief || null,
            status: status || "Planning",
            category: category || "Development",
            budgetHours: budgetHours ? parseInt(budgetHours, 10) : 10,
            targetDelivery: targetDelivery ? new Date(targetDelivery) : null
        }
    })
}

const getBoards = async (userId, page = 1, limit = 6) => {
    const skip = (page - 1) * limit

    const boards = await prisma.board.findMany({
        where: { userId },
        include: {
            columns: true
        },
        skip,
        take: limit
    })

    const totalBoards = await prisma.board.count({
        where: { userId }
    })

    return {
        boards,
        totalBoards,
        currentPage: page,
        totalPages: Math.ceil(totalBoards / limit)
    }
}

const updateBoards = async (id, title) => {
    return await prisma.board.update({
        where: { id },
        data: { title }
    })
}

const deleteBoard = async (id) => {
    return await prisma.board.delete({
        where: { id }
    })
}

const getBoardById = async (id) => {
    return await prisma.board.findUnique({
        where: { id },
        include: {
            columns: {
                orderBy: { position: 'asc' },
                include: {
                    cards: {
                        orderBy: { position: 'asc' }
                    }
                }
            }
        }
    })
}

const searchBoard = async (whereCondition) => {
    return await prisma.board.findMany({
        where: whereCondition,
        orderBy: {
            title: 'asc'
        }
    })
}

module.exports = {
    createBoard,
    getBoards,
    updateBoards,
    deleteBoard,
    getBoardById,
    searchBoard
}