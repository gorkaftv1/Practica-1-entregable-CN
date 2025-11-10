const express = require('express')
const router = express.Router()

const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController')

router.get('/', getAllCars)

router.post('/', createCar)

router.get('/:id', getCarById)

router.put('/:id', updateCar)

router.delete('/:id', deleteCar)

module.exports = router