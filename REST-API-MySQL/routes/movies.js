import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()

  const movieController = new MovieController({ movieModel })

  // middleware para hacer try - catch
  // moviesRouter.use((req, res, next) => {
  //   try {
  //     next()
  //   } catch (error) {
  //     res.status(500).json({ message: error.message })
  //   }
  // })

  moviesRouter.get('/', movieController.getAll)
  moviesRouter.get('/:id', movieController.getByid)
  moviesRouter.post('/', movieController.create)
  moviesRouter.patch('/:id', movieController.update)
  moviesRouter.delete('/:id', movieController.delete)

  return moviesRouter
}
