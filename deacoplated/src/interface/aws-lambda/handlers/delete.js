const DynamoDBCarRepository = require('../../../common/dynamoDb');
const repo = new DynamoDBCarRepository();
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, Authorization, x-api-key',
  'Access-Control-Expose-Headers': 'Content-Length, X-Request-Id'
};

exports.handler = async (event) => {
  const id = (event.pathParameters && event.pathParameters.id) || (event.queryStringParameters && event.queryStringParameters.id);
  if (!id) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'id parameter is required' }) };

  try {
    const existing = await repo.findById(id);
    if (!existing) return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Car not found' }) };

    const deleted = await repo.delete(id);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: deleted || existing, message: 'Car deleted successfully' }) };
  } catch (err) {
    console.error(`Error deleting car (${id}):`, err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal Server Error' }) };
  }
};