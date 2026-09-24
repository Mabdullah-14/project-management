const express = require('express')
const router = express.Router()
const { handleLogin, handleCreateUser, handleForgetPassword, handleResetPassword, handleVerifyUser,handleLogout,handleGetAdminUsersListService,handleProfileImg } = require('../controller/authcontroller')
const { authMiddleware, roleMiddleware } = require('../middleware/authmiddleware')

router.post('/login', handleLogin)
router.post('/create-user', authMiddleware, roleMiddleware('ADMIN'), handleCreateUser)
router.post('/profile-img',authMiddleware,handleProfileImg)
router.post('/forget-password', handleForgetPassword)
router.post('/reset-password/:token', handleResetPassword)
router.get('/verify-user', authMiddleware, handleVerifyUser)
router.post('/logout',handleLogout)
router.get('/managment-list',authMiddleware,roleMiddleware('ADMIN'),handleGetAdminUsersListService)

module.exports = router