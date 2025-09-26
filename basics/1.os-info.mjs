import { platform, release, arch, cpus, totalmem, uptime } from 'os'
import os from 'os'

console.log('INFORMACIÓN DEL SISTEMA OPERATIVO')
console.log('_______________________________')

console.log('Nombre del sistema operativo: ' + platform())
console.log('Versión del sistema operativo: ' + release())
console.log('Arquitectura del sistema operativo: ' + arch())
console.log('Tipo de procesador: ' + cpus()[0].model)
console.log('Memoria total: ' + totalmem() + ' bytes')
console.log('Memoria total: ' + totalmem() + ' bytes')
console.log('Tiempo encendido: ' + uptime() / 60 / 60 + ' horas')
