const { prisma } = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();


const superAdminSeed = async () => {
    try {
        console.log("Db connected");

        const adminExists = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (adminExists) {
            console.log('An Admin Account already exists in database');
            process.exit(0);
        }

        await prisma.user.deleteMany({
            where: { email: "admin@company.com" }
        });

        const plainPassword = "Admin321";
        const hashedPassword = await bcrypt.hash(plainPassword, 12);

        const admin = await prisma.user.create({
            data: {
                name: "Admin",
                email: "admin@company.com",
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log("   Admin user created successfully:", admin.email);
        console.log("   Login with -> email: admin@company.com | password: Admin321");
        process.exit(0);

    } catch (error) {
        console.log("Seeding failure runtime error:");
        console.log(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

superAdminSeed();