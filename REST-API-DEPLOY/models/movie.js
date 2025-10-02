import MOVIES from '../web/movies.json' with { type: 'json' }
import { randomUUID } from 'node:crypto'

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return MOVIES.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      )
    }

    return MOVIES
  }

  static async getById({ id }) {
    const movie = MOVIES.find((movie) => movie.id === id)
    if (movie) {
      return movie
    }
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    }

    MOVIES.push(newMovie)
    return newMovie
  }

  static async delete({ id }) {
    const movieIndex = MOVIES.findIndex((movie) => movie.id === id)

    if (movieIndex < 0) return false

    MOVIES.splice(movieIndex, 1)
    return true
  }

  static async update({ id, input }) {
    const movieIndex = MOVIES.findIndex((movie) => movie.id === id)

    if (movieIndex < 0) return false

    const newMovie = {
      ...MOVIES[movieIndex],
      ...input,
    }

    MOVIES[movieIndex] = newMovie
    return newMovie
  }
}
