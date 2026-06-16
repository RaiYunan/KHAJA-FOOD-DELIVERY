import Review from '../models/review.model.js'
import Product from '../models/product.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Create Review
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const productId = req.params.productId

  // check product exists
  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  // check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  })
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product')
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  })

  await review.populate('user', 'name avatar')

  res.status(201).json({
    success: true,
    review,
  })
})

// Get all reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId

  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: reviews.length,
    averageRating: product.averageRating,
    totalReviews: product.totalReviews,
    reviews,
  })
})

// Update own review
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  // only the review owner can update
  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update your own review')
  }

  review.rating = rating ?? review.rating
  review.comment = comment ?? review.comment
  await review.save()

  await review.populate('user', 'name avatar')

  res.status(200).json({
    success: true,
    review,
  })
})

// Delete own review (admin can delete any)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  const isOwner = review.user.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You can only delete your own review')
  }

  await review.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Review deleted',
  })
})

// Get logged in user's reviews
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('product', 'name image price')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  })
})

// Admin — get all reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'name price')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  })
})