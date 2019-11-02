const express = require('express')
const path = require('path')
const app  = express()
const fs = require('fs')
const mediaserver = require('mediaserver')
const multer = require('multer')

const opcionesMulter = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'canciones'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: opcionesMulter
})

app.use(express.static('public'))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/canciones', (req, res) => {
    fs.readFile(path.join(__dirname, 'canciones.json'), 'utf-8', function (err, canciones) {
        if(err) throw err
        res.json(JSON.parse(canciones))
    })
})

app.post('/canciones', upload.single('cancion'), (req, res) => {
    let nombre = req.file.originalname
    let archivoCanciones = path.join(__dirname, 'canciones.json') 

    fs.readFile( archivoCanciones, 'utf-8', (err, archivo) => {
        if(err) throw err
        let canciones = JSON.parse(archivo)
        canciones.push({ nombre })
            
        fs.writeFile(archivoCanciones, JSON.stringify(canciones), (err) => {
            if(err) throw err
            res.sendFile(path.join(__dirname, 'index.html'))
        })
    })
})

app.get('/canciones/:nombre', (req, res) => {
    const cancion = path.join(__dirname, 'canciones', req.params.nombre)

    mediaserver.pipe(req, res, cancion)
})

app.listen(3000, () => {
    console.log('server listen')
})