import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// middleware para hacer try - catch
// moviesRouter.use((req, res, next) => {
//   try {
//     next()
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:id', MovieController.getByid)
moviesRouter.post('/', MovieController.create)
moviesRouter.patch('/:id', MovieController.update)
moviesRouter.delete('/:id', MovieController.delete)
