const http = require('node:http')
const fs = require('node:fs')

const port = 3000

const processRequest = (req, res) => {
  const { url } = req
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (url === '/') {
    res.statusCode = 200 // OK
    res.end('<h1>Bienvenido a mi página de inicio</h1>')
  } else if (url === '/contacto') {
    res.statusCode = 200 //OK
    res.end('<h1>Página de contacto</h1>')
  } else if (url === '/imagen.jpg') {
    res.statusCode = 200 //OK
    fs.readFile('icono.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500 // Internal Server Error
        res.end('<h1>ERROR 500</h1><p>Error interno del servidor</p>')
      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data)
      }
    })
  } else {
    res.statusCode = 404 // Not Found
    res.end('<h1>ERROR 404</h1><p>Página no encontrada</p>')
  }
}

const server = http.createServer(processRequest)

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
