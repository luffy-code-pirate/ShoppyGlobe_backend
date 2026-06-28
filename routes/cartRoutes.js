// cartRoutes.js - Routes for managing the shopping cart
// All these routes are protected — user must be logged in
// The auth middleware checks the JWT token before allowing access

// POST   /cart        - add a product to the cart
// PUT    /cart/:id    - update quantity of a product in the cart
// DELETE /cart/:id    - remove a product from the cart

import express from 'express'
import Cart    from '../models/Cart.js'
import Product from '../models/Product.js'
import auth    from '../middleware/auth.js'

const router = express.Router()

// ── POST /cart ────────────────────────────────────────────
// Adds a product to the logged in user's cart
// If cart does not exist it creates a new one
// If product already in cart it increases the quantity
router.post('/', auth, async (req, res) => {
  try {

    // Get productId and quantity from request body
    const { productId, quantity = 1 } = req.body

    // Validate that productId is provided
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product id is required',
      })
    }

    // Check if the product actually exists in the database
    // We do not want to add invalid products to the cart
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`,
      })
    }

    // Find the cart that belongs to the logged in user
    // req.user.id comes from the auth middleware after verifying JWT
    let cart = await Cart.findOne({ user: req.user.id })

    // If user has no cart yet create a new one
    if (!cart) {
      cart = new Cart({
        user:  req.user.id,
        items: [],
      })
    }

    // Check if this product is already in the cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {
      // If product already in cart increase its quantity
      existingItem.quantity += quantity
    } else {
      // If product not in cart add it as a new item
      cart.items.push({ product: productId, quantity })
    }

    // Save the updated cart to MongoDB
    await cart.save()

    // Populate product details in the response
    // populate replaces product id with actual product data
    await cart.populate('items.product')

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart,
    })

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id format',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart',
      error:   error.message,
    })
  }
})

// ── PUT /cart/:id ─────────────────────────────────────────
// Updates the quantity of a specific product in the cart
// :id is the product id whose quantity we want to change
router.put('/:id', auth, async (req, res) => {
  try {

    // Get the new quantity from request body
    const { quantity } = req.body

    // Validate quantity is provided and is at least 1
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      })
    }

    // Find the cart for the logged in user
    const cart = await Cart.findOne({ user: req.user.id })

    // If no cart found return error
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    // Find the item in the cart that matches the product id in the URL
    const item = cart.items.find(
      item => item.product.toString() === req.params.id
    )

    // If product not found in cart return error
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart',
      })
    }

    // Update the quantity of the found item
    item.quantity = quantity

    // Save the updated cart to MongoDB
    await cart.save()

    // Populate product details in the response
    await cart.populate('items.product')

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart,
    })

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id format',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart',
      error:   error.message,
    })
  }
})

// ── DELETE /cart/:id ──────────────────────────────────────
// Removes a specific product from the cart
// :id is the product id we want to remove
router.delete('/:id', auth, async (req, res) => {
  try {

    // Find the cart for the logged in user
    const cart = await Cart.findOne({ user: req.user.id })

    // If no cart found return error
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    // Check if the product exists in the cart
    const itemExists = cart.items.find(
      item => item.product.toString() === req.params.id
    )

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart',
      })
    }

    // Filter out the item with the matching product id
    // This removes it from the items array
    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.id
    )

    // Save the updated cart to MongoDB
    await cart.save()

    // Populate product details in the response
    await cart.populate('items.product')

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart,
    })

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id format',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart',
      error:   error.message,
    })
  }
})

export default router