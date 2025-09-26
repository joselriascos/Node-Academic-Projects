const path = require('node:path')

const filePath = path.join('/content/', 'subfolder', 'test.txt')

console.log(filePath)

const base = path.basename('/tmp/hidden-folder/test.txt')
console.log(base)

const filename = path.basename('/tmp/hidden-folder/test.txt', '.txt')
console.log(filename)

const extension = path.extname('image.jpg')
console.log(extension)
