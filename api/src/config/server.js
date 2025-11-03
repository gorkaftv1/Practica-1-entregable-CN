// Config centralizada de la aplicación (sencilla, con overrides desde env)
const env = require('./env')

const toInt = (v, fallback) => {
  const n = Number(v)
  return Number.isInteger(n) ? n : fallback
}

// CORS: en producción evita '*' y usa una lista/domains concretos
const defaultCorsOrigin = '*'
const corsOrigin = process.env.CORS_ORIGIN || defaultCorsOrigin

module.exports = {
  port: env.port,
  host: process.env.HOST || '0.0.0.0',

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Authorization', 'x-api-key'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },

  bodyParser: {
    json: { limit: '5mb', strict: true },
    urlencoded: { limit: '5mb', extended: true }
  },

  timeout: toInt(process.env.SERVER_TIMEOUT_MS, 30000),
  keepAliveTimeout: toInt(process.env.SERVER_KEEPALIVE_MS, 65000),

  response: {
    error: {
      includeStack: env.nodeEnv !== 'production'
    }
  },

  env: env.nodeEnv,
  isDevelopment: env.nodeEnv === 'development',
  isProduction: env.nodeEnv === 'production',
  isTest: env.nodeEnv === 'test'
}