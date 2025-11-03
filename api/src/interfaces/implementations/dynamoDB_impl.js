const { v4: uuidv4 } = require('uuid')
// Interface base
const CarRepository = require('../repositories/carRepository')

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
    QueryCommand,
    DeleteCommand,
    UpdateCommand,
    GetCommand
} = require('@aws-sdk/lib-dynamodb')

const TABLE_NAME = process.env.CARS_TABLE || 'cars'

// Configurar cliente: soporta DYNAMODB_ENDPOINT para localstack/dynamodb-local
const ddbClient = new DynamoDBClient({
    region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined
})

const docClient = DynamoDBDocumentClient.from(ddbClient)

class DynamoDBCarRepository extends CarRepository {
    async create(carData) {
        const { plate, make, model, year, owner } = carData
        const item = {
            id: uuidv4(),
            plate,
            make,
            model,
            year,
            owner,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const params = {
            TableName: TABLE_NAME,
            Item: item
            // Para evitar sobrescribir podrías añadir ConditionExpression: 'attribute_not_exists(id)'
        }

        try {
            await docClient.send(new PutCommand(params))
            return item
        } catch (err) {
            err.message = `Error creating car: ${err.message}`
            throw err
        }
    }

    async findAll({ limitPerPage = 100 } = {}) {
        const allItems = []
        let ExclusiveStartKey = undefined

        try {
            do {
                const params = {
                    TableName: TABLE_NAME,
                    Limit: limitPerPage,
                    ExclusiveStartKey
                }
                const result = await docClient.send(new ScanCommand(params))
                if (result.Items && result.Items.length) {
                    allItems.push(...result.Items)
                }
                ExclusiveStartKey = result.LastEvaluatedKey
            } while (ExclusiveStartKey)

            return allItems
        } catch (err) {
            err.message = `Error scanning cars table: ${err.message}`
            throw err
        }
    }

    async findById(id) {
        if (!id) return null
        try {
            const params = { TableName: TABLE_NAME, Key: { id } }
            const result = await docClient.send(new GetCommand(params))
            return result.Item || null
        } catch (err) {
            err.message = `Error getting car by id: ${err.message}`
            throw err
        }
    }

    async delete(id) {
        if (!id) throw new Error('id is required to delete a car')
        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            ReturnValues: 'ALL_OLD'
        }
        try {
            const result = await docClient.send(new DeleteCommand(params))
            return result.Attributes || null
        } catch (err) {
            err.message = `Error deleting car with id ${id}: ${err.message}`
            throw err
        }
    }

    async update(id, carData) {
        if (!id) throw new Error('id is required to update a car')
        const allowedFields = ['plate', 'make', 'model', 'year', 'owner']
        const fields = Object.keys(carData).filter(k => allowedFields.includes(k) && carData[k] !== undefined)

        if (fields.length === 0) {
            throw new Error('No valid fields provided for update')
        }

        const ExpressionAttributeNames = {}
        const ExpressionAttributeValues = { ':updatedAt': new Date().toISOString() }
        const setParts = []

        fields.forEach((field, idx) => {
            const nameKey = `#f${idx}`
            const valKey = `:v${idx}`
            ExpressionAttributeNames[nameKey] = field
            ExpressionAttributeValues[valKey] = carData[field]
            setParts.push(`${nameKey} = ${valKey}`)
        })

        ExpressionAttributeNames['#updatedAt'] = 'updatedAt'
        setParts.push('#updatedAt = :updatedAt')

        const UpdateExpression = 'SET ' + setParts.join(', ')

        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        }

        try {
            const result = await docClient.send(new UpdateCommand(params))
            return result.Attributes
        } catch (err) {
            err.message = `Error updating car with id ${id}: ${err.message}`
            throw err
        }
    }
}

module.exports = DynamoDBCarRepository