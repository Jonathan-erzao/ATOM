const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ATOM',
  password: '2003',
  port: 5432,
});

const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:4200'

}));

// Configurar body-parser
app.use(bodyParser.json({ limit: '50mb' })); // Establecer un límite mayor según tus necesidades
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Ruta GET para obtener todos los datos de la tabla "Producto"
app.get('/tienda', async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre AS nombre_categoria
      FROM "Producto".producto p
      JOIN "sistema".catalogo c ON p.categoria = c.id
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la tabla Producto:', error);
    res.status(500).json({ error: 'Error al obtener datos de la tabla Producto' });
  }
});


// Método POST para crear un producto
app.post('/crearProducto', async (req, res) => {
  try {
    const {
      id,
      nombre,
      descripcion,
      precioproducto,
      preciocompra,
      stock,
      imagen,
      categoria
    } = req.body;

    const query = `
      INSERT INTO "Producto".producto (id, nombre, descripcion, precioproducto, preciocompra, stock, imagen, categoria)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await pool.query(query, [
      id,
      nombre,
      descripcion,
      precioproducto,
      preciocompra,
      stock,
      imagen,
      categoria
    ]);

    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



//Metodo get para traer los datos de mi usuario
app.get('/usuarios', async (req, res) => {
  try {
    const query = `
    SELECT u.*, d.id_provincia AS nombre_direccion, r.nombre AS nombre_rol
    FROM "Usuario".usuario u
    JOIN "Usuario".direccion d ON u.direccion = d.id
    JOIN sistema.rol r ON u.rol = r.id
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la tabla Usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos de la tabla Usuario' });
  }
});

// Método DELETE para eliminar un usuario por ID
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const query = `
      DELETE FROM "Usuario".usuario
      WHERE id = $1
    `;

    await pool.query(query, [userId]);

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Método DELETE para eliminar un producto por id
app.delete('/inventario/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Verifica si el ID es un número
    if (isNaN(productId)) {
      // Si el ID no es un número, envía un mensaje de error
      return res.status(400).json({ message: 'El ID debe ser un número válido' });
    }

    const query = `
      DELETE FROM "Producto".producto
      WHERE id = $1
    `;

    await pool.query(query, [productId]);

    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
  
});

app.get('/categorias', async (req, res) => {
  try {
    const query = `
    SELECT c.id , c.nombre 
    FROM "sistema".catalogo c
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la tabla Catalogo:', error);
    res.status(500).json({ error: 'Error al obtener datos de la tabla Categoria' });
  }
});

//Metodo get para traer los datos de mis proveedores
app.get('/provedores', async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM "Producto".provedor
      ORDER BY id DESC
      LIMIT 10
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la tabla Producto.provedor:', error);
    res.status(500).json({ error: 'Error al obtener datos de la tabla Producto.provedor' });
  }
});
// Método DELETE para eliminar un provedor por id
app.delete('/provedores/:id', async (req, res) => {
  try {
    const provedorId = req.params.id;

    const query = `
      DELETE FROM "Producto".provedor
      WHERE id = $1
    `;

    await pool.query(query, [provedorId]);

    res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.use((req, res, next) => {
  console.log(`Solicitud ${req.method} a ${req.url}`);
  next();
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

module.exports = app;
