const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const request = require('request')
const jsonfile = require('jsonfile')

const download = (uri, filename, callback) => {
  
  request.head(uri, (err, res, body) => {

    if (err) console.error(err)

    // console.log('_________')
    // console.log('filename:', filename)
    // console.log('content-type:', res.headers['content-type'])
    // console.log('content-length:', res.headers['content-length'])

    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback)

  })

}

const validaExistenciaImagenes = (imgs) => {
  imgs.forEach(i => {
    console.log(`existe ${i} ?`, fs.existsSync(i) ? chalk.bgGreen('Cierto') : chalk.bgRed('Falso'))
  })
}

let famImagenes = jsonfile.readFileSync('./familiasConImagenes.json')
let famTextiles = jsonfile.readFileSync('./familiasConTextiles.json')
let famAudios = jsonfile.readFileSync('./familiasConImagenes.json')

// trunc solo de prueba
famImagenes = famImagenes.reduce((acc, img) => {
  if ( ! acc.length) 
    return img.fotografias
  else 
    return [...acc, ...img.fotografias]
}, []).slice(0, 10) // quitar el slice para todas

let totalImagenesIngresadas = famImagenes.length
let totalImagenesGuardadas = 0
let imagenesGuardadas = []

famImagenes.forEach(i  => {
  let imagePath = i.url.split('http://res.cloudinary.com/centro-cultura-digital/image/upload/v')[1].split('/inali')[1].slice(1)
  folders = imagePath.slice(0, imagePath.lastIndexOf('/'))
  shell.mkdir('-p', folders)
  
  download(i.url, imagePath, () => { 
    totalImagenesGuardadas++
    imagenesGuardadas.push(imagePath)
  })
})

setTimeout(() => {
  console.log(
    'Número de imagenes guardas igual a ingresadas:  ',
    totalImagenesGuardadas === totalImagenesIngresadas ? chalk.bgGreen('Cierto') : chalk.bgRed('Falso')
  )
  validaExistenciaImagenes(imagenesGuardadas)
}, 10000);
