import express from 'express'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
//leemos las variables de entorno
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

dotenv.config()

// Inciamos el puerto
const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app)

const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 300
  }
})

//conexion con la base de datos

const db  = createClient({
  url: "libsql://right-lockheed-tobiasonandia.turso.io",
  authToken: process.env.DB_TOKEN,
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
    )

  
  
  `)

// servir los archivos html, css y javascript
// El client es el nombre del archivo 
app.use(express.static("client"));


io.on('connection', async (socket) => {
  console.log('Un cliente se ha conectado')

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado')
  })

  socket.on('chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
        args: { msg, username }
      })
      
    }
    catch (error) {
      console.log(error)
      return
    }
    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  if(!socket.recovered){
    try {
      const results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach( row => {
        socket.emit('chat message', row.content, row.id.toString(), row.user)
      })
    } catch (error) {
      console.log(error)
      return
    }
  
  }
})


app.get('./', (req, res) => {
  res.render("index")
})

server.listen(PORT, () => {
  console.log(`el servidor esta escuchando en el puerto _${PORT}`)
})
