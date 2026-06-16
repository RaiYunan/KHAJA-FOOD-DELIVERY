import User from '../models/user.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import removeFile from '../utils/removeFile.js'

// Get my profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.status(200).json({ success: true, user })
})

// Update my profile
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  // if new avatar uploaded, remove old one
  if (req.file) {
    removeFile(user.avatar)
    user.avatar = `/uploads/avatars/${req.file.filename}`
  }

  user.name = name ?? user.name
  user.phone = phone ?? user.phone
  user.address = address ?? user.address

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      role: user.role,
    },
  })
})

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required')
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters')
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, 'New password must be different from current password')
  }

  const user = await User.findById(req.user._id)

  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect')
  }

  user.password = newPassword
  await user.save() // pre-save hook hashes it automatically

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  })
})

// Delete my account
export const deleteMyAccount = asyncHandler(async (req, res) => {
  const { password } = req.body

  const user = await User.findById(req.user._id)

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, 'Password is incorrect')
  }

  // remove avatar if exists
  removeFile(user.avatar)

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  })
})