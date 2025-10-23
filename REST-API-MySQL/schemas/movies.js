import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.url({
    invalid_type_error: 'Poster must be a URL',
  }),
  rate: z.number().min(0).max(10).default(5),
  genre: z.array(
    z.enum([
      'Drama',
      'Action',
      'Crime',
      'Adventure',
      'Sci-Fi',
      'Romance',
      'Animation',
      'Biography',
      'Fantasy',
    ])
  ),
})

export function validateMovie(input) {
  return movieSchema.safeParse(input)
}

export function validateParcialMovie(input) {
  return movieSchema.partial().safeParse(input)
}
