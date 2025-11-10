// src/config/env.js
// Centralizar lectura de variables de entorno (simple y robusto)

const toInt = (v, fallback) => {
  const n = Number(v)
  return Number.isInteger(n) ? n : fallback
}


module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT || process.env.APP_PORT, 8080),
  dynamo: {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.DYNAMODB_REGION || 'us-east-1',
    table: process.env.DYNAMODB_TABLE || process.env.CARS_TABLE || 'cars'
  }
}