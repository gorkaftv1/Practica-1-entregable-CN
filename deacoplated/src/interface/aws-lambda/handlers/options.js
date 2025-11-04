// Handler para preflight CORS (OPTIONS) - matching /api configuration
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, Authorization, x-api-key',
  'Access-Control-Expose-Headers': 'Content-Length, X-Request-Id'
};

exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'CORS preflight successful' })
  };
};
