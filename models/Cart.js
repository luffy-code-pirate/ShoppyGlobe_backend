// Cart.js - Mongoose schema for the Cart collection
// Each cart belongs to one user
// A cart contains multiple items — each item has a product and quantity

import mongoose from 'mongoose'

// cartItemSchema defines the structure of each item inside the cart
// We use this as a sub-schema inside the main cart schema
const cartItemSchema = new mongoose.Schema(
  {
    // product - reference to the Product collection
    // mongoose.Schema.Types.ObjectId means this stores a MongoDB id
    // ref: 'Product' tells Mongoose which collection to look up
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: [true, 'Product reference is required'],
    },

    // quantity - how many units of this product are in the cart
    // minimum is 1 — cannot add 0 or negative quantities
    quantity: {
      type:     Number,
      required: [true, 'Quantity is required'],
      min:      [1, 'Quantity must be at least 1'],
      default:  1,
    },
  }
)

// cartSchema defines the structure of the cart document
const cartSchema = new mongoose.Schema(
  {
    // user - reference to the User collection
    // Each cart belongs to exactly one user
    // ref: 'User' tells Mongoose which collection to look up
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User reference is required'],
      unique:   true, // each user can only have one cart
    },

    // items - array of cartItemSchema objects
    // This holds all the products the user has added to their cart
    items: [cartItemSchema],
  },
  {
    // timestamps automatically adds createdAt and updatedAt
    timestamps: true,
  }
)

// Create the Cart model from the schema
// Mongoose will create a collection called 'carts' in MongoDB
const Cart = mongoose.model('Cart', cartSchema)

export default Cart