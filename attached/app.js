const express = require('express')
const cors = require('cors')

const serverConfig = require('./src/config/server')

const carRoutes = require('./src/routes/carRoutes')

const app = express()

app.use(cors(serverConfig.cors || {}))
app.use(express.json(serverConfig.bodyParser && serverConfig.bodyParser.json ? serverConfig.bodyParser.json : {}))
app.use(express.urlencoded(serverConfig.bodyParser && serverConfig.bodyParser.urlencoded ? serverConfig.bodyParser.urlencoded : { extended: true }))

// Rutas
app.use('/cars', carRoutes)

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    environment: serverConfig.env || process.env.NODE_ENV
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(serverConfig.response && serverConfig.response.error && serverConfig.response.error.includeStack ? { stack: err.stack } : {})
  })
})

// Start server
const port = serverConfig.port || process.env.PORT || 3000
const host = serverConfig.host || '0.0.0.0'
const server = app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`)
  if (process.env.SWAGGER_ENABLED !== 'false') {
    console.log(`API Docs: http://${host}:${port}/api-docs`)
  }
})

// Graceful shutdown
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

function shutdown() {
  console.log('Shutting down...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
  
  setTimeout(() => process.exit(1), 10000)
}