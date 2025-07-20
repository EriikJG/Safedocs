// websocket-server.js
const { WebSocketServer } = require('ws')
const http = require('http')

const PORT = 3001

const server = http.createServer()
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Cliente conectado')

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message.toString())

    // Reenviar a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString())
      }
    })
  })

  ws.on('close', () => {
    console.log('Cliente desconectado')
  })
})

server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en ws://localhost:${PORT}`)
})
