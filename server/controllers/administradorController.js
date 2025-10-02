import Administrador from '../models/administrador.js';

// Crear administrador
export const crearAdministrador = async (req, res) => {
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

// Obtener todos los administradores
export const obtenerAdministradores = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, nivel_acceso, activo } = req.query;
    const skip = (pagina - 1) * limite;
    
    let filtro = {};
    if (nivel_acceso) filtro.nivel_acceso = nivel_acceso;
    if (activo !== undefined) filtro.activo = activo === 'true';

    const administradores = await Administrador.find(filtro)
      .populate('usuario_id', 'nombre email Rut')
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ createdAt: -1 });

    const total = await Administrador.countDocuments(filtro);

    res.json({
      administradores,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalAdministradores: total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener administradores',
      error: error.message
    });
  }
};

// Obtener administrador por ID
export const obtenerAdministradorPorId = async (req, res) => {
  try {
    const administrador = await Administrador.findById(req.params.id)
      .populate('usuario_id', 'nombre email Rut');
    
    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json(administrador);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener administrador',
      error: error.message
    });
  }
};

// Actualizar administrador
export const actualizarAdministrador = async (req, res) => {
  try {
    const administradorActualizado = await Administrador.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('usuario_id', 'nombre email Rut');

    if (!administradorActualizado) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json({
      message: 'Administrador actualizado exitosamente',
      administrador: administradorActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar administrador',
      error: error.message
    });
  }
};

// Eliminar administrador
export const eliminarAdministrador = async (req, res) => {
  try {
    const administradorEliminado = await Administrador.findByIdAndDelete(req.params.id);
    
    if (!administradorEliminado) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json({ message: 'Administrador eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar administrador',
      error: error.message
    });
  }
};