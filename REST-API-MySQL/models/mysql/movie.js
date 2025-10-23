import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3307,
  password: '',
  database: 'moviesdb',
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre }) {
    try {
      // get all the movies in database filtered by genre joining the movie, movie_genre and genre tables
      const [result] = await connection.query(
        `SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.poster, m.rate, g.name AS genre
            FROM movie m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genre g ON mg.genre_id = g.id
            ${
              genre
                ? `WHERE m.id IN 
                (SELECT mg2.movie_id FROM movie_genres mg2
                LEFT JOIN genre g2 ON mg2.genre_id = g2.id
                WHERE LOWER(g2.name) = ?)
                `
                : ''
            }`,
        genre ? [genre.toLowerCase()] : []
      )

      if (!result || result.length === 0) {
        return []
      }

      // get genres related to movies
      const movieMap = new Map()

      for (const row of result) {
        if (!movieMap.has(row.id)) {
          movieMap.set(row.id, {
            id: row.id,
            title: row.title,
            year: row.year,
            director: row.director,
            duration: row.duration,
            poster: row.poster,
            rate: row.rate,
            genres: [],
          })
        }

        const movie = movieMap.get(row.id)
        if (!movie.genres.includes(row.genre)) {
          movie.genres.push(row.genre)
        }
      }

      const movies = Array.from(movieMap.values())

      return movies
    } catch (e) {
      return []
    }
  }

  static async getById({ id }) {
    try {
      const [result] = await connection.query(
        `SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.poster, m.rate, g.name AS genre
          FROM movie m
          LEFT JOIN movie_genres mg ON m.id = mg.movie_id
          LEFT JOIN genre g ON mg.genre_id = g.id
          WHERE m.id = UUID_TO_BIN(?)`,
        [id]
      )

      const movieMap = new Map()

      for (const row of result) {
        if (!movieMap.has(row.id)) {
          movieMap.set(row.id, {
            id: row.id,
            title: row.title,
            year: row.year,
            director: row.director,
            poster: row.poster,
            rate: row.rate,
            genres: [],
          })
        }

        const movie = movieMap.get(row.id)
        if (!movie.genres.includes(row.genre)) {
          movie.genres.push(row.genre)
        }
      }

      const movies = Array.from(movieMap.values())

      if (!movies || movies.length === 0) {
        return null
      }

      return movies
    } catch {
      return null
    }
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      poster,
      rate,
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() AS uuid')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
            VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
        [uuid, title, year, director, duration, poster, rate]
      )

      // Get each genre's id
      for (const genre of genreInput) {
        const [genreResult] = await connection.query(
          `SELECT id FROM genre WHERE LOWER(name) = ?`,
          [genre.toLowerCase()]
        )

        if (genreResult.length > 0) {
          const [{ id }] = genreResult
          await connection.query(
            `INSERT INTO movie_genres (movie_id, genre_id)
                VALUES (UUID_TO_BIN(?), ?)`,
            [uuid, id]
          )
        }
      }
    } catch (e) {
      throw new Error('Error creating movie')
    }

    return this.getById({ id: uuid })
  }

  static async delete({ id }) {
    try {
      // Delete movie from movie table
      await connection.query(
        `DELETE FROM movie WHERE id = UUID_TO_BIN(?)`,
        [id]

        // Delete movie from movie_genres table
      )
      await connection.query(
        `DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?)`,
        [id]
      )
      return true
    } catch {
      return false
    }
  }

  static async update({ id, input }) {
    const entries = Object.entries(input).filter(
      ([_, value]) => value !== undefined || value !== null || value !== ''
    )

    const fields = entries.map(([key]) => `${key} = ?`).join(', ')
    const values = entries.map(([, value]) => value)

    const query = `UPDATE movie SET ${fields} WHERE id = UUID_TO_BIN(?)`
    values.push(id)

    try {
      await connection.query(query, values)
      return this.getById({ id })
    } catch {
      return null
    }
  }
}
