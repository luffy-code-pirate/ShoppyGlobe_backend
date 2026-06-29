// seed.js - Script to add sample products to MongoDB
// Run this file once with: node seed.js
// It will add 10 sample products to the products collection

import mongoose  from 'mongoose'
import dotenv    from 'dotenv'
import Product   from './models/Product.js'

// Load environment variables from .env file
dotenv.config()

// Sample products data to insert into MongoDB
const products = [
  {
    name:        'iPhone 15 Pro',
    price:       134900,
    description: 'Latest Apple iPhone with A17 Pro chip, titanium design and 48MP camera system.',
    stock:       50,
    category:    'Electronics',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=iPhone+15+Pro',
  },
  {
    name:        'Samsung Galaxy S24',
    price:       79999,
    description: 'Samsung flagship with Snapdragon 8 Gen 3, 200MP camera and AI features.',
    stock:       40,
    category:    'Electronics',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Samsung+S24',
  },
  {
    name:        'Sony WH-1000XM5',
    price:       29990,
    description: 'Industry leading noise cancelling wireless headphones with 30 hour battery.',
    stock:       30,
    category:    'Audio',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Sony+WH1000XM5',
  },
  {
    name:        'MacBook Air M2',
    price:       114900,
    description: 'Supercharged by M2 chip, incredibly thin design with 18 hour battery life.',
    stock:       25,
    category:    'Laptops',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=MacBook+Air+M2',
  },
  {
    name:        'Nike Air Max 270',
    price:       12995,
    description: 'Lightweight and comfortable running shoes with Air Max cushioning technology.',
    stock:       100,
    category:    'Footwear',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Nike+Air+Max',
  },
  {
    name:        'Levi\'s 501 Original Jeans',
    price:       3999,
    description: 'Classic straight fit jeans in authentic denim with signature button fly.',
    stock:       80,
    category:    'Clothing',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Levis+501',
  },
  {
    name:        'LG 4K Smart TV 55 inch',
    price:       59990,
    description: 'UHD 4K Smart TV with WebOS, Dolby Vision and AI ThinQ technology.',
    stock:       20,
    category:    'Electronics',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=LG+4K+TV',
  },
  {
    name:        'Instant Pot Duo 7 in 1',
    price:       8999,
    description: 'Multi use pressure cooker, slow cooker, rice cooker, steamer and more.',
    stock:       60,
    category:    'Kitchen',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Instant+Pot',
  },
  {
    name:        'Canon EOS R50',
    price:       69990,
    description: 'Mirrorless camera with 24.2MP sensor, 4K video and Dual Pixel autofocus.',
    stock:       15,
    category:    'Cameras',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Canon+EOS+R50',
  },
  {
    name:        'Fitbit Charge 6',
    price:       14999,
    description: 'Advanced fitness tracker with heart rate monitoring, GPS and 7 day battery.',
    stock:       45,
    category:    'Wearables',
    imageUrl:    'https://dummyjson.com/image/400x200/008080/ffffff?text=Fitbit+Charge+6',
  },
]

// connectAndSeed - connects to MongoDB and inserts the sample products
async function connectAndSeed() {
  try {

    // Connect to MongoDB using the connection string from .env
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected for seeding...')

    // Delete all existing products first
    // This prevents duplicate products if seed is run multiple times
    await Product.deleteMany()
    console.log('Existing products cleared...')

    // Insert all sample products at once
    const inserted = await Product.insertMany(products)
    console.log(`${inserted.length} products inserted successfully!`)

    // Show the inserted product names
    inserted.forEach(p => console.log(`  - ${p.name}`))

    console.log('Seeding complete!')

  } catch (error) {
    console.error('Seeding failed:', error.message)

  } finally {
    // Always disconnect after seeding is done
    await mongoose.disconnect()
    console.log('MongoDB Disconnected.')
    process.exit(0)
  }
}

// Run the seed function
connectAndSeed()