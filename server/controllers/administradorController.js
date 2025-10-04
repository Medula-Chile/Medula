const Administrador = require('../models/administrador');

exports.crearAdministrador = async (req, res) => {
  try {
    const nuevoAdministrador = new Administrador(req.body);
    const administradorGuardado = await nuevoAdministrador.save();
    
    await administradorGuardado.populate('usuario_id', 'nombre email Rut');
    
    res.status(201).json({
      message: 'Administrador creado exitosamente',
      administrador: administradorGuardado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear administrador',
      error: error.message
    });
  }
};

exports.obtenerAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find()
      .populate('usuario_id', 'nombre email Rut')
      .sort({ createdAt: -1 });

    res.json(administradores);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener administradores',
      error: error.message
    });
  }
};