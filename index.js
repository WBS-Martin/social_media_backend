import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import helmet from 'helmet'

import 'dotenv/config'

import userRoute from './routes/user.js'
import authRoute from './routes/auth.js'
import postRoute from './routes/post.js'

const app = express()
const port = 8800

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  },
  () => console.log('MongoDB connected')
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo db connection error:'))

app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
