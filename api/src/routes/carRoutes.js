const express = require('express')
const router = express.Router()

const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController')

/**
 * @swagger
 * components:
 *   parameters:
 *     CarId:
 *       name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: ID del vehículo
 *       example: "car-123"
 *
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del vehículo
 *           example: "car-123"
 *         plate:
 *           type: string
 *           description: Matrícula del vehículo
 *           example: "ABC-1234"
 *         make:
 *           type: string
 *           description: Marca del vehículo
 *           example: "Toyota"
 *         model:
 *           type: string
 *           description: Modelo del vehículo
 *           example: "Corolla"
 *         year:
 *           type: integer
 *           description: Año del vehículo
 *           example: 2023
 *         owner:
 *           type: string
 *           description: Propietario del vehículo
 *           example: "Juan Pérez"
 *
 *     CarInput:
 *       type: object
 *       required:
 *         - plate
 *         - make
 *         - model
 *         - year
 *         - owner
 *       properties:
 *         plate:
 *           type: string
 *           description: Matrícula del vehículo
 *           example: "ABC-1234"
 *         make:
 *           type: string
 *           description: Marca del vehículo
 *           example: "Toyota"
 *         model:
 *           type: string
 *           description: Modelo del vehículo
 *           example: "Corolla"
 *         year:
 *           type: integer
 *           description: Año del vehículo
 *           example: 2023
 *         owner:
 *           type: string
 *           description: Propietario del vehículo
 *           example: "Juan Pérez"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *         message:
 *           type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Error message"
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Cars]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Filtrar por marca
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *                 count:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: API Key no válida o faltante
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAllCars)

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Crear un nuevo vehículo
 *     tags: [Cars]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInput'
 *     responses:
 *       201:
 *         description: Vehículo creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Matrícula duplicada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Car with this plate already exists"
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createCar)

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Obtener un vehículo por ID
 *     tags: [Cars]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getCarById)

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     tags: [Cars]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInput'
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Matrícula ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateCar)

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Cars]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Vehículo eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteCar)

module.exports = router