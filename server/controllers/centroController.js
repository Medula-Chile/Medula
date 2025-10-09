const CentroSalud = require('../models/centroSalud');

exports.crearCentro = async (req, res) => {
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

exports.obtenerCentros = async (req, res) => {
    try {
        const centros = await CentroSalud.find().sort({ nombre: 1 });
        res.json(centros);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener centros de salud',
            error: error.message
        });
    }
};

exports.obtenerCentroPorId = async (req, res) => {
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

exports.actualizarCentro = async (req, res) => {
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

exports.eliminarCentro = async (req, res) => {
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

exports.toggleCentro = async (req, res) => {
    try {
        const centro = await CentroSalud.findById(req.params.id);

        if (!centro) {
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        centro.activo = !centro.activo;
        const centroActualizado = await centro.save();

        res.json({
            message: `Centro de salud ${centroActualizado.activo ? 'activado' : 'desactivado'} exitosamente`,
            centro: centroActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al cambiar estado del centro de salud',
            error: error.message
        });
    }
};

exports.buscarCentros = async (req, res) => {
    try {
        const query = req.query.q;
        const centros = await CentroSalud.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { direccion: { $regex: query, $options: 'i' } },
                { comuna: { $regex: query, $options: 'i' } },
                { telefono: { $regex: query, $options: 'i' } },
                { especialidades: { $in: [new RegExp(query, 'i')] } }
            ]
        }).sort({ nombre: 1 });

        res.json(centros);
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar centros de salud',
            error: error.message
        });
    }
};