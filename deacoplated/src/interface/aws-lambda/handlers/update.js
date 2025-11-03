const DynamoDBCarRepository = require('../../../common/dynamoDb');
const { validateCarPayload } = require('../../../common/validation');
const repo = new DynamoDBCarRepository();
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
};

exports.handler = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'id parameter is required' }) };

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Invalid JSON body' }) };
  }

  const updatableFields = ['plate', 'make', 'model', 'year', 'owner'];
  const hasUpdate = Object.keys(payload || {}).some(k => updatableFields.includes(k));
  if (!hasUpdate) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'No data to update' }) };

  const validation = validateCarPayload(payload, false);
  if (!validation.valid) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: validation.message }) };

  try {
    const existing = await repo.findById(id);
    if (!existing) return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Car not found' }) };

    const updated = await repo.update(id, payload);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: updated, message: 'Car updated successfully' }) };
  } catch (err) {
    console.error(`Error updating car (${id}):`, err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal Server Error' }) };
  }
};