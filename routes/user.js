import express from 'express'
import bcrypt from 'bcrypt'

import User from '../models/user.js'

const router = express.Router()

//change user
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { userId, password, isAdmin } = req.body
  if (userId === id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
      } catch (error) {
        res.status(500).send(error)
      }
    }
    try {
      const user = await User.findByIdAndUpdate(id, { $set: req.body })
      res.status(200).json('Account has been updated')
    } catch (error) {
      res.status(500).send(error)
    }
  } else {
    res.status(403).json('unauthorized')
  }
})

//delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { userId, isAdmin } = req.body
  if (userId === id || isAdmin) {
    try {
      const user = await User.findByIdAndDelete(id)
      res.status(200).json('User has been deleted')
    } catch (error) {
      res.status(500).send(error)
    }
  } else {
    res.status(403).json('unauthorized')
  }
})

//get user
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    const { password, updatedAt, ...other } = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).send(error)
  }
})

//follow a user
router.put('/:id/follow', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (!user.following.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } })
        await currentUser.updateOne({ $push: { following: id } })
        res.status(200).json('User has been followed')
      } else {
        res.status(403).json('user already following')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  } else {
    res.status(403).json('you cant follow yourself')
  }
})

//unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (user.following.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } })
        await currentUser.updateOne({ $pull: { following: id } })
        res.status(200).json('User has been unfollowed')
      } else {
        res.status(403).json('user already unfollowing')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  } else {
    res.status(403).json('you cant unfollow yourself')
  }
})

export default router
