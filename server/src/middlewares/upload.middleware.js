import multer from 'multer'
import path from 'path'
import fs from 'fs'

const createStorage = (folder) => {
  const uploadDir = `uploads/${folder}`
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
      cb(null, uniqueName)
    },
  })
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpeg, png, jpg, webp) are allowed'), false)
  }
}

export const uploadProduct = multer({
  storage: createStorage('products'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const uploadAvatar = multer({
  storage: createStorage('avatars'),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for avatars
})