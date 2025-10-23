import express from 'express'
import serverless from 'serverless-http'

import { createMovieRouter } from '../routes/movies.js'
import { MovieModel } from '../models/mysql/movie.js'
import { corsMiddleware } from '../middlewares/cors.js'

const PORT = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')

// Middlewares
app.use(express.json())
app.use(corsMiddleware())

const movieRouter = createMovieRouter({ movieModel: MovieModel })

app.use('/movies', movieRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

// Start server
// export const handler = serverless(app)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
