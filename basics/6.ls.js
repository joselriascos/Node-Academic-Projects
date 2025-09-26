const fs = require('node:fs/promises')
const path = require('node:path')
const pc = require('picocolors')

const folder = process.argv[2] ?? '.'

async function ls(folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch {
    console.error(pc.red(`No se pudo encotrar el folder ${folder}`))
    process.exit(1)
  }

  const filesPromises = files.map(async (file) => {
    const filePath = path.join(folder, file)
    let stats

    try {
      stats = await fs.stat(filePath)
      const isDirectory = stats.isDirectory()
      const fileType = isDirectory ? 'd' : '-'
      const fileSize = stats.size
      const fileModified = stats.mtime.toLocaleString()

      return `${fileType} ${file.padEnd(20)} ${fileSize
        .toString()
        .padStart(10)} ${fileModified}`
    } catch {
      console.error(pc.red(`No se pudo leer el archivo ${filePath}`))
      process.exit(1)
    }
  })

  const filesInfo = await Promise.all(filesPromises)

  filesInfo.forEach((file) => {
    console.log(file)
  })
}

ls(folder)
