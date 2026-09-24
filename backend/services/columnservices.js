const {prisma}=require('../config/db')

const createCoulumn=async(title,position,boardId)=>{
    return await prisma.column.create({
        data:{
            title,
             position: parseInt(position) || 0,
             boardId
        }
    })
}

const getCoulumnsByBoard=async(boardId)=>{
    return await prisma.column.findMany({
        where:{boardId},
        orderBy:{position:'asc'},
        include:{
            cards:{
                orderBy:{
                    position:'asc'
                }
            }
        }
    })
}

const updateCoulumn = async (id, title, position) => {
    return await prisma.column.update({
        where: { id },
        data: {
            title,
            position: position !== undefined ? parseInt(position) : undefined
        }
    });
};

const deleteCoulumn=async(id)=>{
     return await prisma.column.delete({
        where: { id }
    });
}

const reorderColumnService = async (columnId, boardId, sourceIndex, destIndex) => {
    return await prisma.$transaction(async (tx) => {
        const srcIdx = parseInt(sourceIndex);
        const destIdx = parseInt(destIndex);

        if (srcIdx < destIdx) {
            await tx.column.updateMany({
                where: {
                    boardId: boardId,
                    position: { gt: srcIdx, lte: destIdx },
                },
                data: {
                    position: { decrement: 1 }
                }
            });
        } else {
            await tx.column.updateMany({
                where: {
                    boardId: boardId,
                    position: { gte: destIdx, lt: srcIdx },
                },
                data: { 
                    position: { increment: 1 } 
                }
            });
        }

        return await tx.column.update({
            where: { id: columnId },
            data: { position: destIdx },
        });
    });
};

const searchColumn=async(whereCondition)=>{
    return await prisma.column.findMany({
        where: whereCondition,
        orderBy: { position: 'asc' } 
    });
}

module.exports={
    createCoulumn,
    getCoulumnsByBoard,
    updateCoulumn,
    deleteCoulumn,
    reorderColumnService,
    searchColumn
}