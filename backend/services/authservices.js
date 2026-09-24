const { prisma } = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto=require('crypto')
const sendEmail=require('../utils/sendEmail')


const createUser = async ({ name, email, password, role }) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() } 
    })
    if (existingUser) {
         throw new Error("User with this email already exists.");
    }

    const allowedRoles=["ADMIN","MEMBER"];
    const finalRole=allowedRoles.includes(role)?role:'MEMBER';
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role:finalRole
        }
    })
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return { newUser, token }
}

const login = async ({ email, password }) => {
    if (!email) {
        throw new Error("Email parameter is missing.");
    }

    const existingUser = await prisma.user.findUnique({
         where: { email: email.toLowerCase() } 
    })
    if (!existingUser) {
        throw new Error("User with this email does not exist.");
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid credentials payload verification failed.");
    }

    const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email, name: existingUser.name, role: existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { existingUser, token };
}

const forgetPassword=async({email})=>{
   const user=await prisma.user.findUnique({where:{email}})
   if(!user){
    throw new Error("user with this email not found")
   }
   const resetToken=crypto.randomBytes(16).toString('hex')
   user.resetPasswordToken=resetToken
   await prisma.user.update({
    where:{
        id:user.id
    },
    data:{
        resetPasswordToken:resetToken
    }
   })
   const resetUrl=`http://localhost:5173/reset-password/${resetToken}`
   const message = `You requested a password reset. Please Click this link to send a new password :\n:\n ${resetUrl}\n\n IF you did not this so ignore this email`;
   await sendEmail({
    email:user.email,
    subject:"COLLABRATION BOARD",
    message

   })
   return resetToken
}

const resetPassword=async({token,password})=>{
    const user=await prisma.user.findFirst({where:{resetPasswordToken:token}})
    if(!user){
        throw new Error("Invalid or Expired reset token")
    }
    const hashedPassword=await bcrypt.hash(password,12)
    await prisma.user.update({
        where:{
            id:user.id,

        },
        data:{
            password:hashedPassword,
            resetPasswordToken:null
        }
    })
    return {
        message: "Password reset successfully"
    };
}

const verifyUser=async({userId})=>{
    const user=await prisma.user.findUnique({
        where:{
            id:userId
        }
    });
     if (!user) {
        throw new Error("User not found.");
    }
    
    return { user };
}
const getAdminUsersListService=async()=>{
    return await prisma.user.findMany({
        select:{
            id:true,
            name:true,
            email:true,
            role:true,
            createdAt:true
        },
        orderBy:{
            createdAt:'asc'
        }
    })
}

const updateProfileImg=async({id,imagePath})=>{
    const updatedUser=await prisma.user.update({
        where:{id:id},
        data:{profileImage: imagePath}
    })
    return updatedUser
}


module.exports = { login, createUser,forgetPassword,resetPassword,verifyUser,getAdminUsersListService,updateProfileImg }
