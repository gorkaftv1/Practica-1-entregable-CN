const env = require('../config/env');

// Determinar backend a usar: env var, fallback a env.use provista por la config, o POSTGRES

let CarRepository;

const DynamoDBCarRepository = require('./implementations/dynamoDB_impl');
  
console.log(`Using CarRepository implementation: dynammoDB`);
CarRepository = new DynamoDBCarRepository();
module.exports = CarRepository;
