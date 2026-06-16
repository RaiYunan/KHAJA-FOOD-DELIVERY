import express from 'express'
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
} from '../controllers/profile.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { uploadAvatar } from '../middlewares/upload.middleware.js'

const router = express.Router()

router.use(protect) // all profile routes require login

router.get('/', getMyProfile)
router.put('/', uploadAvatar.single('avatar'), updateMyProfile)
router.patch('/change-password', changePassword)
router.delete('/', deleteMyAccount)

export default router