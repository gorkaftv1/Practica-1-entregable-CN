// Handler para preflight CORS (OPTIONS)
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
};

exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'CORS preflight successful' })
  };
};
