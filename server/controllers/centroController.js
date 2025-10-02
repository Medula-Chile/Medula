const CentroSalud = require('../models/CentroSalud');

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