const { prisma } = require('../config/db');

// 1. CREATE CARD
const createCard = async (title, description, columnId, position, userId, priority, ets, eta, completionTime, feedBack) => {
    return await prisma.$transaction(async (txt) => {
        const card = await txt.card.create({
            data: {
                title,
                description,
                columnId,
                position: parseInt(position) || 0,
                version: 1,
                priority: priority || "Medium",
                ets: ets ? parseInt(ets, 10) : null,
                eta: eta ? new Date(eta) : null,
                completionTime: completionTime ? new Date(completionTime) : null,
                feedBack: feedBack || null
            }
        });
        await txt.cardHistory.create({
            data: {
                cardId: card.id,
                userId,
                action: 'Card created successfully.'
            }
        });
        return card;
    });
};

// 2. GET CARD
const getCard = async () => {
    return await prisma.card.findMany({
        orderBy: { position: 'asc' },
        include: { history: true }
    });
};

// 3. UPDATE CARD (Fully synchronized with English logs)
const updateCard = async (id, title, description, incomingVersion, userId, priority, ets, eta, completionTime, feedBack) => {
    return await prisma.$transaction(async (txt) => {
        // 1. Check if the card exists
        const currentCard = await txt.card.findUnique({
            where: { id: id }
        });

        if (!currentCard) {
            throw { status: 404, message: "Card not found!" };
        }

        // 2. Concurrency Check (OCC)
        if (currentCard.version !== incomingVersion) {
            throw {
                status: 409,
                message: "This card was edited by another user.",
                currentServerState: currentCard
            };
        }

        // 3. Update all properties and bump version
        const updatedCardData = await txt.card.update({
            where: { id },
            data: {
                title,
                description,
                version: incomingVersion + 1, 
                priority: priority || "Medium",
                ets: ets ? parseInt(ets, 10) : null,
                eta: eta ? new Date(eta) : null,
                completionTime: completionTime ? new Date(completionTime) : null,
                feedBack: feedBack || null
            }
        });

        // 4. English Audit Trail Logging
        await txt.cardHistory.create({
            data: {
                cardId: id,
                userId,
                action: `Card properties updated. Version bumped to ${incomingVersion + 1}`
            }
        });

        return updatedCardData;
    });
};

// 4. DELETE CARD
const deleteCard = async (id) => {
    return await prisma.card.delete({
        where: { id }
    });
};

// 5. REORDER CARD SERVICE
const recordCardService = async (cardId, sourceColId, destColId, sourceIndex, destIndex) => {
    return await prisma.$transaction(async (txt) => {
        const srcIdx = parseInt(sourceIndex);
        const destIdx = parseInt(destIndex);

        if (sourceColId === destColId) {
            if (srcIdx < destIdx) {
                await txt.card.updateMany({
                    where: {
                        columnId: sourceColId,
                        position: { gt: srcIdx, lte: destIdx },
                    },
                    data: { position: { decrement: 1 } }, 
                });
            } else {
                await txt.card.updateMany({
                    where: {
                        columnId: sourceColId,
                        position: { gte: destIdx, lt: srcIdx },
                    },
                    data: { position: { increment: 1 } }, 
                });
            }

            return await txt.card.update({
                where: { id: cardId },
                data: { position: destIdx },
            });
        } 
        else {
            await txt.card.updateMany({
                where: {
                    columnId: sourceColId,
                    position: { gt: srcIdx },
                },
                data: { position: { decrement: 1 } },
            });   

            await txt.card.updateMany({
                where: {
                    columnId: destColId,
                    position: { gte: destIdx },
                },
                data: { position: { increment: 1 } },
            });

            return await txt.card.update({
                where: { id: cardId },
                data: {
                    columnId: destColId,
                    position: destIdx,
                    version:{increment:1}
                },
            });
        }
    });
};

const searchCard=async(whereCondition)=>{
    return await prisma.card.findMany({
        where:whereCondition,
        orderBy:{position:'asc'}
    })
}

module.exports = {
    createCard,
    getCard,
    updateCard,
    deleteCard,
    recordCardService ,
    searchCard
};
