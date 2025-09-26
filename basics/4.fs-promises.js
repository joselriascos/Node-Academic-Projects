const fs = require('node:fs/promises')

fs.readFile('./archivo2.txt', 'utf-8')
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })

console.log('cosas que se ejecutan mientras se lee el documento')
