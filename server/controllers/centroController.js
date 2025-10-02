import CentroSalud from '../models/centroSalud.js';

// Crear centro de salud
export const crearCentro = async (req, res) => {
    try {
        const nuevoCentro = new CentroSalud(req.body);
        const centroGuardado = await nuevoCentro.save();

        res.status(201).json({
            message: 'Centro de salud creado exitosamente',
            centro: centroGuardado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear centro de salud',
            error: error.message
        });
    }
};

// Obtener todos los centros de salud
export const obtenerCentros = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, comuna, activo } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (comuna) filtro.comuna = new RegExp(comuna, 'i');
        if (activo !== undefined) filtro.activo = activo === 'true';

        const centros = await CentroSalud.find(filtro)
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ nombre: 1 });

        const total = await CentroSalud.countDocuments(filtro);

        res.json({
            centros,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalCentros: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener centros de salud',
            error: error.message
        });
    }
};

// Obtener centro por ID
export const obtenerCentroPorId = async (req, res) => {
    try {
        const centro = await CentroSalud.findById(req.params.id);

        if (!centro) {
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        res.json(centro);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener centro de salud',
            error: error.message
        });
    }
};

// Actualizar centro
export const actualizarCentro = async (req, res) => {
    try {
        const centroActualizado = await CentroSalud.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!centroActualizado) {
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        res.json({
            message: 'Centro de salud actualizado exitosamente',
            centro: centroActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar centro de salud',
            error: error.message
        });
    }
};

// Eliminar centro
export const eliminarCentro = async (req, res) => {
    try {
        const centroEliminado = await CentroSalud.findByIdAndDelete(req.params.id);

        if (!centroEliminado) {
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        res.json({ message: 'Centro de salud eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar centro de salud',
            error: error.message
        });
    }
};