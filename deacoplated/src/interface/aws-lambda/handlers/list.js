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
  try {
    const limitPerPage = event.queryStringParameters && event.queryStringParameters.limitPerPage
      ? Number(event.queryStringParameters.limitPerPage)
      : undefined;

    const items = await repo.findAll({ limitPerPage });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data: items, count: Array.isArray(items) ? items.length : undefined })
    };
  } catch (err) {
    console.error('Error listing cars:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal Server Error' }) };
  }
};