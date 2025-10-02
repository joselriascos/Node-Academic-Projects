import { validateMovie, validateParcialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js'

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })

    res.json(movies)
  }

  static async getByid(req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({ message: 'Movie not found' })
    }
  }

  static async create(req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })
    return res.status(201).json(newMovie)
  }

  static async update(req, res) {
    const result = validateParcialMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMovie = await MovieModel.update({ id, input: result.data })

    if (!updatedMovie)
      return res.status(404).json({ message: 'Movie not found' })

    return res.json(updatedMovie)
  }

  static async delete(req, res) {
    const { id } = req.params
    const movieDeleted = await MovieModel.delete({ id })

    if (!movieDeleted) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.status(204).json()
  }
}
