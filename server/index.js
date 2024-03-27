import express from 'express'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
// Inciamos el puerto
const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 300
  }
})

// servir los archivos html, css y javascript
// El client es el nombre del archivo 
app.use(express.static("client"));



io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado')

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})


app.get('/', (req, res) => {
  res.render("index")
})

server.listen(PORT, () => {
  console.log(`el servidor esta escuchando en el puerto _${PORT}`)
})
