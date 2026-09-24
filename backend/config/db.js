const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg"); 


const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Connected successfully via Prisma Pg-Adapter!");
    } catch (error) {
        console.error("DB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, prisma };
