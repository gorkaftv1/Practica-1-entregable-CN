const DynamoDBCarRepository = require('../../../common/dynamoDb');
const { validateCarPayload } = require('../../../common/validation');
const repo = new DynamoDBCarRepository();
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, Authorization, x-api-key',
  'Access-Control-Expose-Headers': 'Content-Length, X-Request-Id'
};

exports.handler = async (event) => {
  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Invalid JSON body' }) };
  }

  const validation = validateCarPayload(payload, true);
  if (!validation.valid) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: validation.message }) };

  try {
    const newCar = await repo.create(payload);
    return { statusCode: 201, headers, body: JSON.stringify({ success: true, data: newCar, message: 'Car created successfully' }) };
  } catch (err) {
    console.error('Error creating car:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal Server Error' }) };
  }
};