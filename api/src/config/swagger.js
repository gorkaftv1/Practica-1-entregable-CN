const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const env = require('./env') // o require('./config').env según tu estructura

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || env.port || 3000
const protocol = process.env.API_PROTOCOL || 'http'
const baseUrl = process.env.API_BASE_URL || `${protocol}://${host}:${port}`

// Habilitar Swagger siempre, a menos que se deshabilite explícitamente
const enableSwagger = process.env.SWAGGER_ENABLED !== 'false'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cars API',
      version: '1.0.0',
      description: 'API para gestión de vehículos',
      contact: { name: 'API Support' },
      // opcional
      // termsOfService: 'https://example.com/terms',
      // license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' }
    },
    servers: [
      {
        url: baseUrl,
        description: process.env.API_SERVER_DESCRIPTION || 'API server'
      }
    ],
    tags: [
      { name: 'Cars', description: 'Endpoints para gestión de vehículos' },
      { name: 'Health', description: 'Endpoints de estado del servidor' }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key requerida para acceder a los endpoints (excepto /health y /api-docs)'
        }
      }
    },
    security: [] // por defecto no exigir seguridad global; se especifica por endpoint
  },

  // Ajusta los globs para que coja todo el código donde pongas las anotaciones
  apis: [
    // si tus rutas están en src/routes y controladores en src/controllers:
    './src/routes/**/*.js',
    './src/controllers/**/*.js',
    './src/models/**/*.js',
    './app.js'
  ]
}

const specs = swaggerJsdoc(options)

function setupSwagger(app) {
  if (!enableSwagger) {
    // No montar Swagger en producción salvo que explícitamente lo habilites
    console.log('Swagger disabled in this environment')
    return
  }

  // UI options: puedes ajustar layout, deepLinking, persistAuthorization, etc.
  const uiOptions = {
    explorer: false,
    swaggerOptions: {
      docExpansion: process.env.SWAGGER_DOC_EXPANSION || 'list',
      persistAuthorization: process.env.SWAGGER_PERSIST_AUTH === 'true'
    }
  }

  // Montar en /api-docs para consistencia con API Gateway
  app.use('/prod/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions))
  console.log(`✅ Swagger UI available at ${baseUrl}/prod/api-docs`)
}

module.exports = { specs, swaggerUi, setupSwagger, enableSwagger }