/**
 * Interfaz/base class para repositorios de coches.
 * Implementaciones concretas (Postgres, DynamoDB, etc.) deben extender esta clase
 * y sobrescribir los métodos. Todos los métodos son de instancia.
 */
class CarRepository {
  /**
   * Obtener todos los coches.
   * @returns {Promise<Array<Object>>}
   */
  async findAll() {
    throw new Error('findAll() not implemented')
  }

  /**
   * Obtener un coche por su id (clave primaria).
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    throw new Error('findById(id) not implemented')
  }

  /**
   * Crear un nuevo coche.
   * @param {Object} carData
   * @returns {Promise<Object>} - el registro creado
   */
  async create(carData) {
    throw new Error('create(carData) not implemented')
  }

  /**
   * Actualizar un coche existente por id.
   * @param {string} id
   * @param {Object} carData
   * @returns {Promise<Object|null>} - el registro actualizado
   */
  async update(id, carData) {
    throw new Error('update(id, carData) not implemented')
  }

  /**
   * Eliminar un coche por id.
   * @param {string} id
   * @returns {Promise<Object|null>} - el registro eliminado (si procede)
   */
  async delete(id) {
    throw new Error('delete(id) not implemented')
  }
}

module.exports = CarRepository