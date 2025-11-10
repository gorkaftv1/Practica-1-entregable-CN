// Controller consistente usando `id` como clave primaria
// Asume repositorios con métodos:
//   findAll(), findById(id), , create(data), update(id, data), delete(id)

const CarRepository = require('../interfaces');

// Validación simple del payload de coche
const validateCarPayload = (payload, requireAllFields = true) => {
  const { plate, make, model, year, owner } = payload || {};
  const missing = [];
  if (requireAllFields) {
    if (!plate) missing.push('plate');
    if (!make) missing.push('make');
    if (!model) missing.push('model');
    if (year === undefined || year === null) missing.push('year');
    if (!owner) missing.push('owner');
  }


  if (missing.length) {
    return { valid: false, message: `Missing required fields: ${missing.join(', ')}` };
  }

  if (year !== undefined && year !== null) {
    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1886 || yearNum > 3000) {
      return { valid: false, message: 'Invalid value for year' };
    }
  }

  return { valid: true };
};

// GET /cars
const getAllCars = async (req, res) => {
  try {
    const cars = await CarRepository.findAll();
    return res.status(200).json({
      success: true,
      data: cars,
      count: Array.isArray(cars) ? cars.length : undefined
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET /cars/:id
const getCarById = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, error: 'id parameter is required' });

  try {
    const car = await CarRepository.findById(id);
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
    return res.status(200).json({ success: true, data: car });
  } catch (error) {
    console.error(`Error fetching car by id (${id}):`, error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// POST /cars
const createCar = async (req, res) => {
  const payload = req.body;
  const validation = validateCarPayload(payload, true);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.message });
  }

  console.log('Creating car with payload:', payload);
  try {
    const newCar = await CarRepository.create(payload);
    return res.status(201).json({ success: true, data: newCar, message: 'Car created successfully' });
  } catch (error) {
    console.error('Error creating car:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// PUT /cars/:id
const updateCar = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  if (!id) return res.status(400).json({ success: false, error: 'id parameter is required' });

  // Verificar que haya campos para actualizar
  const updatableFields = ['plate', 'make', 'model', 'year', 'owner'];
  const hasUpdate = Object.keys(payload || {}).some(k => updatableFields.includes(k));
  if (!hasUpdate) {
    return res.status(400).json({ success: false, error: 'No data to update' });
  }

  const validation = validateCarPayload(payload, false);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.message });
  }

  try {
    const existing = await CarRepository.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    const updated = await CarRepository.update(id, payload);
    return res.status(200).json({ success: true, data: updated, message: 'Car updated successfully' });
  } catch (error) {
    console.error(`Error updating car (${id}):`, error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// DELETE /cars/:id
const deleteCar = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, error: 'id parameter is required' });

  try {
    const existing = await CarRepository.findById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Car not found' });

    // Se espera que delete(id) borre y opcionalmente retorne el item eliminado
    let deleted = null;
    if (typeof CarRepository.delete === 'function') {
      deleted = await CarRepository.delete(id);
    } else if (typeof CarRepository.deleteById === 'function') {
      deleted = await CarRepository.deleteById(id);
    } else {
      // Intentar fallback
      await CarRepository.delete(id);
    }

    return res.status(200).json({ success: true, data: deleted || existing, message: 'Car deleted successfully' });
  } catch (error) {
    console.error(`Error deleting car (${id}):`, error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};