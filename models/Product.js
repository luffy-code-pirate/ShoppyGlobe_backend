// Product.js - Mongoose schema for the Product collection
// This defines the structure of product documents in MongoDB
// Each product has a name, price, description and stock quantity

import mongoose from 'mongoose'

// Define the shape of a product document in MongoDB
const productSchema = new mongoose.Schema(
  {
    // name - the product name, must be provided
    name: {
      type:     String,
      required: [true, 'Product name is required'],
      trim:     true,
    },

    // price - must be a positive number
    price: {
      type:     Number,
      required: [true, 'Product price is required'],
      min:      [0, 'Price cannot be negative'],
    },

    // description - detailed info about the product
    description: {
      type:     String,
      required: [true, 'Product description is required'],
      trim:     true,
    },

    // stock - how many units are available
    // cannot go below 0
    stock: {
      type:    Number,
      required: [true, 'Stock quantity is required'],
      min:      [0, 'Stock cannot be negative'],
      default:  0,
    },

    // category - optional field to group products
    category: {
      type:    String,
      trim:    true,
      default: 'General',
    },

    // imageUrl - optional product image link
    imageUrl: {
      type:    String,
      default: '',
    },
  },
  {
    // timestamps automatically adds createdAt and updatedAt
    timestamps: true,
  }
)

// Create the Product model from the schema
// Mongoose will create a collection called 'products' in MongoDB
const Product = mongoose.model('Product', productSchema)

export default Product