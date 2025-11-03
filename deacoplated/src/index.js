// Dispatcher: selecciona el handler según process.env.HANDLER_NAME
// Cada handler must export `exports.handler = async (event, context) => {...}`

const create = require('./interface/aws-lambda/handlers/create');
const list = require('./interface/aws-lambda/handlers/list');
const get = require('./interface/aws-lambda/handlers/get');
const update = require('./interface/aws-lambda/handlers/update');
const del = require('./interface/aws-lambda/handlers/delete');
const options = require('./interface/aws-lambda/handlers/options');

const which = (process.env.HANDLER_NAME || process.env.AWS_LAMBDA_FUNCTION_NAME || 'get').toLowerCase();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
  'Content-Type': 'application/json'
};

module.exports.handler = async (event, context) => {
  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return options.handler(event, context);
  }

  switch (which) {
    case 'create':
    case 'createcar':
      return create.handler(event, context);
    case 'list':
    case 'getall':
    case 'getallcars':
      return list.handler(event, context);
    case 'get':
    case 'getcar':
      return get.handler(event, context);
    case 'update':
      return update.handler(event, context);
    case 'delete':
    case 'remove':
      return del.handler(event, context);
    case 'options':
      return options.handler(event, context);
    default:
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: `Unknown handler ${which}` })
      };
  }
};