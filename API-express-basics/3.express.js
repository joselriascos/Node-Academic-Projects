const express = require('express')
const dittoJSON = require('./pokemon/ditto.json')

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')

// middleware que se ejecuta cuando la url empieza por /pokemon
app.use('/pokemon', (req, res, next) => {
  console.log('mi primer middleware')
  next()
})

app.use(express.json())

// HACE LO MISMO QUE LA DE ARRIBA
// middleware para procesar el POST y enviar el JSON resultante en el body de la request
// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   // Solo pasan las request de tipo POST que pasan un JSON
//   let body = ''

//   req.on('data', (chunk) => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     data.timestamp = Date.now()
//     // mutar la request y meter la infromación en el req.body
//     req.body = data
//     next()
//   })
// })

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  const data = req.body
  data.timestamp = Date.now()
  res.status(201).json(data)
})

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
