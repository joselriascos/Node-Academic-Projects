const http = require('node:http')

const dittoJSON = require('./pokemon/ditto.json')

const port = 3000

const processRequest = (req, res) => {
  const { url, method } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(dittoJSON))
          return

        default:
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.statusCode = 404
          res.end('<h1>Error 404</h1>')
          return
      }

    case 'POST':
      switch (url) {
        case '/pokemon':
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            res.writeHead(201, {
              'Content-Type': 'application/json; charset=utf-8',
            })
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })
          return

        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('<h1>404</h1>')
          return
      }
  }
}

const server = http.createServer(processRequest)

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
