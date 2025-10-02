import Medicamento from '../models/medicamentos.js';

// Crear medicamento
export const crearMedicamento = async (req, res) => {
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

// Obtener todos los medicamentos
export const obtenerMedicamentos = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, nombre, principio_activo, laboratorio, activo } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (nombre) filtro.nombre = new RegExp(nombre, 'i');
        if (principio_activo) filtro.principio_activo = new RegExp(principio_activo, 'i');
        if (laboratorio) filtro.laboratorio = new RegExp(laboratorio, 'i');
        if (activo !== undefined) filtro.activo = activo === 'true';

        const medicamentos = await Medicamento.find(filtro)
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ nombre: 1 });

        const total = await Medicamento.countDocuments(filtro);

        res.json({
            medicamentos,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalMedicamentos: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener medicamentos',
            error: error.message
        });
    }
};

// Obtener medicamento por ID
export const obtenerMedicamentoPorId = async (req, res) => {
    try {
        const medicamento = await Medicamento.findById(req.params.id);

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        res.json(medicamento);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener medicamento',
            error: error.message
        });
    }
};

// Buscar medicamentos por nombre
export const buscarMedicamentos = async (req, res) => {
    try {
        const { termino } = req.query;

        if (!termino) {
            return res.status(400).json({ message: 'Término de búsqueda requerido' });
        }

        const medicamentos = await Medicamento.find({
            $or: [
                { nombre: new RegExp(termino, 'i') },
                { principio_activo: new RegExp(termino, 'i') },
                { laboratorio: new RegExp(termino, 'i') }
            ],
            activo: true
        })
            .limit(20)
            .sort({ nombre: 1 });

        res.json({
            medicamentos,
            total: medicamentos.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar medicamentos',
            error: error.message
        });
    }
};

// Actualizar medicamento
export const actualizarMedicamento = async (req, res) => {
    try {
        const medicamentoActualizado = await Medicamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!medicamentoActualizado) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        res.json({
            message: 'Medicamento actualizado exitosamente',
            medicamento: medicamentoActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar medicamento',
            error: error.message
        });
    }
};

// Eliminar medicamento
export const eliminarMedicamento = async (req, res) => {
    try {
        const medicamentoEliminado = await Medicamento.findByIdAndDelete(req.params.id);

        if (!medicamentoEliminado) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        res.json({ message: 'Medicamento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar medicamento',
            error: error.message
        });
    }
};

// Desactivar medicamento
export const desactivarMedicamento = async (req, res) => {
    try {
        const medicamento = await Medicamento.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        );

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        res.json({
            message: 'Medicamento desactivado exitosamente',
            medicamento
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al desactivar medicamento',
            error: error.message
        });
    }
};