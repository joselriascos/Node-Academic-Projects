import express from 'express'
import serverless from 'serverless-http'

import { moviesRouter } from '../routes/movies.js'
import { corsMiddleware } from '../middlewares/cors.js'

const PORT = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')

// Middlewares
app.use(express.json())
app.use(corsMiddleware())

app.use('/movies', moviesRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

// Start server
export const handler = serverless(app)

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`)
// })
