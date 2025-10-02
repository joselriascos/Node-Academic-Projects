const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const serverless = require('serverless-http')
const { validateMovie, validateParcialMovie } = require('../schemas/movies')

const MOVIES = require('../movies.json')

const PORT = process.env.PORT || 3000

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8888',
  'https://movie-api-rest.netlify.app',
]

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
)

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
  // const genres = MOVIES.reduce((acc, movie) => {
  //   movie.genre.forEach((genre) => {
  //     if (!acc.includes(genre)) {
  //       acc.push(genre)
  //     }
  //   })
  //   return acc
  // }, [])
  // res.json({ genres })
})

router.get('/movies', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  const { genre } = req.query
  if (genre) {
    const movies = MOVIES.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    if (movies.length > 0) return res.json(movies)
    return res.status(404).json({ message: 'Movies not found' })
  }

  res.json(MOVIES)
})

router.get('/movies/:id', (req, res) => {
  const { id } = req.params
  if (id === 'filter') return
  const movie = MOVIES.find((movie) => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404).json({ message: 'Movie not found' })
  }
})

router.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  } else {
    const newMovie = {
      id: crypto.randomUUID(),
      ...result.data,
    }
    MOVIES.push(newMovie)
    return res.status(201).json(result.data)
  }
})

router.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validateParcialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const movieIndex = MOVIES.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const newMovie = { ...MOVIES[movieIndex], ...result.data }
  MOVIES[movieIndex] = newMovie
  return res.json(newMovie)
})

router.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = MOVIES.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  MOVIES.splice(movieIndex, 1)

  return res.status(204).json()
})

app.use('/', router)

// Iniciar servidor serverless
module.exports.handler = serverless(app)

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`)
// })
