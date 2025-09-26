const fs = require('node:fs')

fs.readFile('./archivo2.txt', 'utf-8', (err, data) => { // <--------- Se ejecuta cuando se lee el archivo
  console.log(data)
})

console.log('cosas que se ejecutan mientras se lee el documento')
