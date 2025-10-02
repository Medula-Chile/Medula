const Medicamento = require('../models/medicamentos');

exports.crearMedicamento = async (req, res) => {
    try {
        const nuevoMedicamento = new Medicamento(req.body);
        const medicamentoGuardado = await nuevoMedicamento.save();

        res.status(201).json({
            message: 'Medicamento creado exitosamente',
            medicamento: medicamentoGuardado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear medicamento',
            error: error.message
        });
    }
};

exports.obtenerMedicamentos = async (req, res) => {
    try {
        const medicamentos = await Medicamento.find().sort({ nombre: 1 });
        res.json(medicamentos);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener medicamentos',
            error: error.message
        });
    }
};