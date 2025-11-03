# Cars API Frontend

Frontend simple para interactuar con la API de coches.

## 🚀 Características

- ✅ Gestión completa de coches (CRUD)
- ✅ Configuración flexible de URL y API Key
- ✅ Diseño responsivo y moderno
- ✅ Almacenamiento local de configuración
- ✅ Test de conexión con el backend
- ✅ Notificaciones toast
- ✅ Sin dependencias (Vanilla JavaScript)

## 📋 Uso

### Opción 1: Abrir directamente
Simplemente abre `index.html` en tu navegador.

### Opción 2: Servidor local
```bash
# Con Python 3
python -m http.server 3000

# Con Node.js (http-server)
npx http-server -p 3000
```

Luego accede a: `http://localhost:3000`

## ⚙️ Configuración

1. Haz clic en el botón **"⚙️ Configuración"**
2. Ingresa la **URL de tu API**:
   - Local: `http://localhost:8080`
   - AWS: `https://xxxxx.execute-api.us-east-1.amazonaws.com/prod`
3. Ingresa tu **API Key** (si es requerida)
4. Haz clic en **"💾 Guardar Configuración"**
5. Opcionalmente, prueba la conexión con **"🔌 Probar Conexión"**

## 🎨 Capturas

- Panel de configuración desplegable
- Lista de coches en tarjetas
- Modal para crear/editar coches
- Estadísticas en tiempo real
- Notificaciones tipo toast

## 🔐 Seguridad

- La API Key se almacena en `localStorage`
- Puedes mostrar/ocultar la API Key con el botón del ojo
- Los headers se envían automáticamente en cada petición

## 🌐 Endpoints soportados

- `GET /health` - Health check
- `GET /cars` - Listar todos los coches
- `POST /cars` - Crear un coche
- `GET /cars/:id` - Obtener un coche
- `PUT /cars/:id` - Actualizar un coche
- `DELETE /cars/:id` - Eliminar un coche

## 📱 Responsive

El frontend está optimizado para:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🛠️ Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- LocalStorage API
- Fetch API
