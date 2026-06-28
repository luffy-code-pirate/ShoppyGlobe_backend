// authRoutes.js - Routes for user registration and login
// POST /register - creates a new user account
// POST /login    - authenticates user and returns a JWT token

import express  from 'express'
import bcrypt   from 'bcryptjs'
import jwt      from 'jsonwebtoken'
import User     from '../models/User.js'

const router = express.Router()

// ── POST /register ────────────────────────────────────────
// Creates a new user in the database
// Hashes the password before saving using bcryptjs
router.post('/register', async (req, res) => {
  try {

    // Destructure the fields from the request body
    const { username, email, password } = req.body

    // Validate that all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password',
      })
    }

    // Check if a user with this email already exists
    // We do not want duplicate accounts
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'This username is already taken',
      })
    }

    // Hash the password before saving to database
    // The number 10 is the salt rounds — higher is more secure but slower
    // Never store plain text passwords in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user document in MongoDB
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    // Return success response
    // We do not return the password even hashed
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
      },
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error:   error.message,
    })
  }
})

// ── POST /login ───────────────────────────────────────────
// Authenticates a user and returns a JWT token
// The client must send this token with every protected request
router.post('/login', async (req, res) => {
  try {

    // Destructure email and password from request body
    const { email, password } = req.body

    // Validate that both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find the user by email in the database
    const user = await User.findOne({ email })

    // If no user found with this email, return error
    // We say "invalid credentials" instead of "email not found"
    // for security — we do not want to reveal which emails exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Compare the provided password with the hashed password in database
    // bcrypt.compare returns true if they match, false if not
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Create a JWT token with the user id as the payload
    // The token is signed with JWT_SECRET from .env
    // It expires in 7 days — after that user must log in again
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return the token and user info
    // The client stores this token and sends it with protected requests
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
      },
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error:   error.message,
    })
  }
})

export default router