import express from 'express'
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getMyReviews,
  getAllReviews,
} from '../controllers/review.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'

const router = express.Router()

// public
router.get('/product/:productId', getProductReviews)

// logged in user
router.post('/product/:productId', protect, createReview)
router.get('/my-reviews', protect, getMyReviews)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)

// admin only
router.get('/', protect, authorize('admin'), getAllReviews)

export default router