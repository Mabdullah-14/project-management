const { rateLimit } = require('express-rate-limit'); 

const cardWriteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 35,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too Many Requests',
            message: 'You are updating cards too quickly. Please wait for 1 minute.'
        });
    }
});

const authLimiter=rateLimit({
    windowMs:1 * 60 * 1000,
    limit:8,
    standardHeaders:'draft-8',
    legacyHeaders:false,
    handler:(req,res)=>{
        res.status(429).json({
            error: 'Too Many Requests',
            message: 'Too many login attempts. Please try again after 1 minute.'
        })
    }
})

const selectiveWriteLimit = (req, res, next) => {
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
        return cardWriteLimiter(req, res, next);
    }
    next();
};

module.exports = { selectiveWriteLimit ,authLimiter}; 
