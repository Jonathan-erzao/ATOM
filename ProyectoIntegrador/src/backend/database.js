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
app.use(express.json());

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

// Método PUT para actualizar un producto específico
app.put('/acproductos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({ message: 'No se han proporcionado datos para actualizar' });
    }

    const { nombre, descripcion, precioproducto, preciocompra, stock, imagen, categoria } = req.body;

    if (!nombre || !descripcion || !precioproducto || !preciocompra || !stock || !imagen || !categoria) {
      return res.status(400).json({ message: 'Faltan datos para actualizar el producto' });
    }

    const query = `
      UPDATE "Producto".producto
      SET nombre = $2, descripcion = $3, precioproducto = $4, preciocompra = $5, stock = $6, imagen = $7, categoria = $8
      WHERE id = $1
    `;

    const values = [id, nombre, descripcion, precioproducto, preciocompra, stock, imagen, categoria];
    const result = await pool.query(query, values);

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
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
//Traer categorias
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
//Traer roles
app.get('/roles', async (req, res) => {
  try {
    const query = `
    SELECT r.id , r.rnombre 
    FROM "sistema".rol r
    
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la tabla Catalogo:', error);
    res.status(500).json({ error: 'Error al obtener datos de la tabla Categoria' });
  }
});


//Metodo get para traer los datos de mi usuario
app.get('/usuarios', async (req, res) => {
  try {
    const query = `
    SELECT u.id, u.nombre, u.correo, u.contraseña, d.id_provincia, d.id_canton, d.calle, r.rnombre 
    FROM "Usuario".usuario u
    join "Usuario".direccion d on u.direccion = d.id
    join sistema.rol r on u.rol = r.id
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la tabla Usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos de la tabla Usuario' });
  }
});
//Crear Usuario
app.post('/crearUsuario', async (req, res) => {
  try {
    const {
      nombre,
      correo,
      contraseña,
      id_provincia,
      id_canton,
      calle,
      rol
    } = req.body;

    // Primera consulta para insertar la dirección en la tabla de direcciones
    const queryDireccion = `
      INSERT INTO "Usuario".direccion (id_provincia, id_canton, calle)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const resultDireccion = await pool.query(queryDireccion, [id_provincia, id_canton, calle]);
    const direccionId = resultDireccion.rows[0].id;

    // Segunda consulta para insertar el usuario en la tabla de usuarios
    const queryUsuario = `
      INSERT INTO "Usuario".usuario (nombre, correo, contraseña, rol, direccion)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(queryUsuario, [nombre, correo, contraseña, rol, direccionId]);

    res.status(201).json({ message: 'Usuario y dirección creados exitosamente' });
  } catch (error) {
    console.error('Error al crear el usuario y la dirección:', error);
    res.status(500).json({ error: 'Error al crear el usuario y la dirección' });
  }
});




// Método DELETE para eliminar un usuario por ID
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Primero, elimina todos los mensajes asociados a este usuario
    const deleteMessagesQuery = `
    DELETE FROM "Usuario".comentario
    WHERE id_usuario = $1
    `;

    await pool.query(deleteMessagesQuery, [userId]);

    // Luego, elimina el usuario
    const deleteUserQuery = `
      DELETE FROM "Usuario".usuario
      WHERE id = $1
    `;

    await pool.query(deleteUserQuery, [userId]);

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Método PUT para actualizar un producto específico
app.put('/acUsuario/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({ message: 'No se han proporcionado datos para actualizar' });
    }

    const { nombre, correo, contraseña, id_provincia, id_canton, calle, rol } = req.body;

    if (!nombre || !correo || !contraseña || !id_provincia || !id_canton || !calle || !rol) {
      return res.status(400).json({ message: 'Faltan datos para actualizar el usuario' });
    }

    const updateUsuarioQuery = `
      UPDATE "Usuario".usuario
      SET nombre = $2, correo = $3, contraseña = $4, rol = $5
      WHERE id = $1;
    `;

    const updateDireccionQuery = `
      UPDATE "Usuario".direccion
      SET id_provincia = $2, id_canton = $3, calle = $4
      WHERE id = (
        SELECT direccion FROM "Usuario".usuario WHERE id = $1
      );
    `;

    await Promise.all([
      pool.query(updateUsuarioQuery, [id, nombre, correo, contraseña, rol]),
      pool.query(updateDireccionQuery, [id, id_provincia, id_canton, calle]),
    ]);

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});
// Método GET para obtener datos  de los proveedores
app.get('/provedores', async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, descripcion, correo
      FROM "Producto".provedor
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
//Agregar proveedores 
app.post('/agregarProvedores', async (req, res) => {
  try {
    const { nombre, descripcion, correo } = req.body;

    const query = `
      INSERT INTO "Producto".provedor (nombre, descripcion, correo)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [nombre, descripcion, correo];

    const result = await pool.query(query, values);

    res.status(201).json({ id: result.rows[0].id, message: 'Proveedor creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Método PUT para actualizar un provedor específico
app.put('/acprovedor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, correo } = req.body;

    const query = `
      UPDATE "Producto".provedor
      SET nombre = $1, descripcion = $2, correo = $3
      WHERE id = $4
    `;

    const values = [nombre, descripcion, correo, id];

    await pool.query(query, values);

    res.json({ message: 'Proveedor actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener Comentarios
app.get('/obtenerComentarios', async (req, res) => {
  try {
    // Consulta para obtener los comentarios y los nombres de los usuarios de la tabla de comentarios
    const queryComentarios = `
      SELECT c.id, c.id_usuario, u.nombre, c.comentario, c.fecha
      FROM "Usuario".comentario c
      JOIN "Usuario".usuario u ON c.id_usuario = u.id
    `;

    const resultComentarios = await pool.query(queryComentarios);
    const comentarios = resultComentarios.rows;

    res.status(200).json(comentarios);
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

// Insertar Comentario
app.post('/insertarComentario', async (req, res) => {
  try {
    const { id_usuario, comentario } = req.body;

    const query = `
      INSERT INTO "Usuario".comentario (id_usuario, comentario)
      VALUES ($1, $2)
    `;

    const values = [id_usuario, comentario];

    await pool.query(query, values);

    res.json({ message: 'Comentario insertado exitosamente' });
  } catch (error) {
    console.error('Error al insertar el comentario:', error);
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
