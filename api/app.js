const express = require('express')
const cors = require('cors')

const serverConfig = require('./src/config/server')
const { setupSwagger } = require('./src/config/swagger')

const carRoutes = require('./src/routes/carRoutes')

const app = express()

app.use(cors(serverConfig.cors || {}))
app.use(express.json(serverConfig.bodyParser && serverConfig.bodyParser.json ? serverConfig.bodyParser.json : {}))
app.use(express.urlencoded(serverConfig.bodyParser && serverConfig.bodyParser.urlencoded ? serverConfig.bodyParser.urlencoded : { extended: true }))

if (typeof setupSwagger === 'function') {
  try {
    setupSwagger(app)
    console.log('Swagger mounted via setupSwagger()')
  } catch (err) {
    console.warn('Failed to mount swagger via setupSwagger():', err.message)
  }
} else {
  try {
    const { specs, swaggerUi } = require('./src/config/swagger')
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))
    console.log('Swagger UI available at /api-docs')
  } catch (err) {
  }
}

// Rutas
app.use('/cars', carRoutes)

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: El servidor está funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API is running"
 *                 environment:
 *                   type: string
 *                   example: "production"
 */
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