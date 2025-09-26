const http = require('node:http')
const { findAvailablePort } = require('./9.free-port')
require('dotenv').config()

const desiredPort = process.env.PORT

async function main() {
  const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Hello world')
  })

  const port = await findAvailablePort(desiredPort)

  server.listen(port, () => {
    console.log(`server listening on http://localhost:${server.address().port}`)
  })
}

main()
