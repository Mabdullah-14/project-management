const { createCard, getCard, updateCard, deleteCard, recordCardService,searchCard } = require('../services/cardservices');

// 1. CREATE CARD
const handleCreateCard = async (req, res) => {
    try {
        const { title, description, columnId, position, priority, ets, eta, completionTime, feedBack } = req.body;
        if (!title || !columnId) {
            return res.status(400).json({ message: "Title and Column ID are required!" });
        }

        const userId = req.user?.id;

        const newCard = await createCard(title, description, columnId, position, userId, priority, ets, eta, completionTime, feedBack);
        
        return res.status(201).json({ message: "Card created successfully!", data: newCard });  
    } catch (error) {
         return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. GET ALL CARDS
const handlegetCards = async (req, res) => {
    try {
        const cards = await getCard();
        return res.status(200).json(cards);
    } catch (error) {
         return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const handleUpdateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const bodyData = req.body || {};
    
    const { 
        title, 
        description, 
        version, 
        priority = "Medium", 
        ets, 
        eta, 
        completionTime, 
        feedBack 
    } = bodyData;
 
    if (version === undefined || version === null) {
        return res.status(400).json({ message: "Version field is mandatory for concurrency validation!" });
    }
 
    const parsedVersion = req.body.version !== undefined ? parseInt(req.body.version, 10) : 1;
if (isNaN(parsedVersion)) {
    return res.status(400).json({ message: "Version must be a valid number." });
}
 
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required." });
    }
    const userId = req.user.id;

    // 💡 SAFETY DEFENSE: Khali dates ko fixed standard formats mein badlein taake Prisma crash na ho
    const cleanEta = eta && eta.trim() !== "" ? new Date(eta) : null;
    const cleanCompletionTime = completionTime && completionTime.trim() !== "" ? new Date(completionTime) : null;
    const cleanEts = ets ? parseInt(ets, 10) : null;
 
    // Safely parameters forward kar rahe hain updated variables ke sath
    const updatedCard = await updateCard(
        id, 
        title, 
        description, 
        parsedVersion, 
        userId, 
        priority, 
        cleanEts, 
        cleanEta, 
        cleanCompletionTime, 
        feedBack
    );
 
    return res.status(200).json({ message: "Card updated successfully!", data: updatedCard });
 
  } catch (error) {
    if (error.status) {
        return res.status(error.status).json({
            message: error.message,
            currentServerState: error.currentServerState || null
        });
    }
    console.error("Prisma Database Crash Logs:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// 4. DELETE CARD
const handledeleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCard(id);
        return res.status(200).json({ message: "Card deleted successfully!" });
    } catch (error) {
         return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 5. REORDER CARD
const handleReorderCard = async (req, res) => {
    try {
        const { cardId, sourceColId, destColId, sourceIndex, destIndex } = req.body;

        if (!cardId || !sourceColId || !destColId || sourceIndex === undefined || destIndex === undefined) {
            return res.status(400).json({ message: "Missing required fields for card layout updates!" });
        }

        if (sourceColId === destColId && parseInt(sourceIndex, 10) === parseInt(destIndex, 10)) {
            return res.status(200).json({ message: "Card layout position unmodified." });
        }

        const resultData = await recordCardService(cardId, sourceColId, destColId, sourceIndex, destIndex);
        return res.status(200).json({ message: "Card reordered successfully!", data: resultData });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const handleSearchCard = async (req, res) => {
    try {
        const { search,boardId } = req.query;
        if (!boardId) {
            return res.status(400).json({ success: false, message: "boardId is required" });
        }
         
        let whereCondition = {
            column:{
                boardId:boardId
            }
        };
        if (search) {
            whereCondition.title = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const results = await searchCard(whereCondition);
        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error searching cards',
            error: error.message
        });
    }
};

module.exports = {
    handleCreateCard,
    handlegetCards,
    handleUpdateCard,
    handledeleteCard,
    handleReorderCard,
    handleSearchCard
};
