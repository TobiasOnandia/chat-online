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
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
  console.log(`el servidor esta escuchando en el puerto _${PORT}`)
})
