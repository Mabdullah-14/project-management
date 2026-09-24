const { login, createUser, forgetPassword, resetPassword, verifyUser ,getAdminUsersListService,updateProfileImg} = require('../services/authservices');

const cookie_Option = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
};

const handleCreateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
 
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }
 
        const result = await createUser({ name, email, password, role });
        
        const userObj = result.newUser?.user || result.newUser;
 
        return res
            .status(201)
            .json({
                success: true,
                message: `${userObj.role} created successfully.`,
                user: userObj
            });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const authData = await login({ email, password }); 
        
        const userObj = authData.existingUser?.user || authData.existingUser;
        
        return res
            .status(200)
            .cookie('token', authData.token, cookie_Option)
            .json({
                success: true,
                message: "Login successful.", 
                user: userObj
            });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const handleForgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }
        await forgetPassword({ email })
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        })
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
}

const handleResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body
        if (!password) {
            return res.status(400).json({ message: "New password is required" });
        }
        const result = await resetPassword({ password, token })
        return res.status(200).json({
            success: true,
            message: result.message
        })
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const handleVerifyUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const verifiedResult = await verifyUser({ userId })
        
        const cleanUserData = verifiedResult?.user || verifiedResult;

        return res.status(200).json({
            success: true,
            authenticated: true,
            user: cleanUserData 
        })
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const handleLogout=async(req,res)=>{
    try{
        return res.status(200)
        .clearCookie('token',cookie_Option)
        .json('Logout successfully')


    }catch(err){
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

const handleGetAdminUsersListService=async(req,res)=>{
    try{
        
        const users=await getAdminUsersListService()
        return res.status(200).json({
            users
        })

    }catch(error){
         return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const handleProfileImg=async(req,res)=>{
    try{
        const id=req.user.id
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imagePath=`/uploads/${req.file.filename}`
        const updatedUser=await updateProfileImg({id,imagePath})

        return res.status(200).json({
            success: true,
            message: "Profile image updated!",
            user: updatedUser
        });

    }catch(error){
        return res.status(400).json({ success: false, message: error.message });

    }
}



module.exports = { handleCreateUser, handleLogin, handleForgetPassword, handleResetPassword, handleVerifyUser,handleLogout,handleGetAdminUsersListService,handleProfileImg };
