const DynamoDBCarRepository = require('../../../common/dynamoDb');
const repo = new DynamoDBCarRepository();
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
};

exports.handler = async (event) => {
  const id = (event.pathParameters && event.pathParameters.id) || (event.queryStringParameters && event.queryStringParameters.id);
  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'id parameter is required' }) };
  }

  try {
    const car = await repo.findById(id);
    if (!car) return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Car not found' }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: car }) };
  } catch (error) {
    console.error(`Error fetching car by id (${id}):`, error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal Server Error' }) };
  }
};