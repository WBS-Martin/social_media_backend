import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: { type: String, min: 3, max: 20, unique: true, required: true },
    email: { type: String, max: 50, unique: true, required: true },
    password: { type: String, min: 6, required: true },
    profilepicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    followers: [{ type: Array, default: [] }],
    following: [{ type: Array, default: [] }],
    isAdmin: { type: Boolean, default: false },
    desc: { type: String, max: 50, default: '' },
    city: { type: String, max: 50, default: '' },
    from: { type: String, max: 50, default: '' },
    relationship: { type: Number, enum: [1, 2, 3] },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
