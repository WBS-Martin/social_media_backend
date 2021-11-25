import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'

const router = express.Router()

//register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({ username, email, password: hashedPassword })
    const user = await newUser.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    !user && res.status(404).json('user not found')
    const validPassword = await bcrypt.compare(password, user.password)
    !validPassword && res.status(400).json('invalid password')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
