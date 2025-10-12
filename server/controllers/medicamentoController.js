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

// Semilla programática de 100+ medicamentos por combinatoria
exports.sembrarDefault = async (req, res) => {
    try {
        const bases = [
            { nombre: 'Paracetamol', principio: 'Paracetamol', laboratorio: 'Genérico' },
            { nombre: 'Ibuprofeno', principio: 'Ibuprofeno', laboratorio: 'Genérico' },
            { nombre: 'Amoxicilina', principio: 'Amoxicilina', laboratorio: 'Farmalab' },
            { nombre: 'Omeprazol', principio: 'Omeprazol', laboratorio: 'Farmalab' },
            { nombre: 'Losartán', principio: 'Losartán', laboratorio: 'CardioPharm' },
            { nombre: 'Metformina', principio: 'Metformina', laboratorio: 'EndoMed' },
            { nombre: 'Atorvastatina', principio: 'Atorvastatina', laboratorio: 'CardioPharm' },
            { nombre: 'Levotiroxina', principio: 'Levotiroxina', laboratorio: 'EndoMed' },
            { nombre: 'Salbutamol', principio: 'Salbutamol', laboratorio: 'Respira' },
            { nombre: 'Cetirizina', principio: 'Cetirizina', laboratorio: 'AllerGo' },
            { nombre: 'Clonazepam', principio: 'Clonazepam', laboratorio: 'NeuroLab' },
            { nombre: 'Escitalopram', principio: 'Escitalopram', laboratorio: 'NeuroLab' }
        ];
        const dosis = ['5 mg', '10 mg', '20 mg', '40 mg', '100 mg', '500 mg', '850 mg', '1 g'];
        const presentaciones = ['Tabletas', 'Cápsulas', 'Jarabe', 'Suspensión', 'Gotas'];

        const buildDescripcion = (b) => `Medicamento ${b.nombre} (${b.principio}). Uso según indicación médica.`;

        const toInsert = [];
        const seen = new Set();
        for (const b of bases) {
            for (const d of dosis) {
                for (const p of presentaciones) {
                    const key = [b.nombre, d, p, b.laboratorio].join('|').toLowerCase();
                    if (seen.has(key)) continue;
                    seen.add(key);
                    toInsert.push({
                        nombre: b.nombre,
                        principio_activo: b.principio,
                        dosis: d,
                        presentacion: p,
                        laboratorio: b.laboratorio,
                        codigo_estandar: '',
                        descripcion: buildDescripcion(b),
                        contraindicaciones: '',
                        activo: true,
                    });
                }
            }
        }

        // Evitar duplicados existentes en BD por combinación básica
        // Estrategia: intentar insertMany y capturar parciales.
        const result = await Medicamento.insertMany(toInsert, { ordered: false });
        return res.status(201).json({ message: 'Semilla creada', insertados: result.length });
    } catch (error) {
        if (error?.insertedDocs) {
            return res.status(201).json({ message: 'Semilla parcial creada', insertados: error.insertedDocs.length });
        }
        return res.status(500).json({ message: 'Error al sembrar medicamentos', error: error.message });
    }
};

exports.obtenerMedicamentos = async (req, res) => {
    try {
        const { q, activo } = req.query;
        const filter = {};
        if (q) {
            const rx = new RegExp(q, 'i');
            filter.$or = [
                { nombre: rx },
                { principio_activo: rx },
                { laboratorio: rx },
                { codigo_estandar: rx },
                { descripcion: rx }
            ];
        }
        if (typeof activo !== 'undefined') {
            filter.activo = String(activo) === 'true';
        }
        const medicamentos = await Medicamento.find(filter).sort({ nombre: 1 });
        res.json(medicamentos);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener medicamentos',
            error: error.message
        });
    }
};

exports.obtenerMedicamentoPorId = async (req, res) => {
    try {
        const med = await Medicamento.findById(req.params.id);
        if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
        res.json(med);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener medicamento', error: error.message });
    }
};

exports.actualizarMedicamento = async (req, res) => {
    try {
        const med = await Medicamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
        res.json({ message: 'Medicamento actualizado', medicamento: med });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar medicamento', error: error.message });
    }
};

exports.eliminarMedicamento = async (req, res) => {
    try {
        const med = await Medicamento.findByIdAndDelete(req.params.id);
        if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
        res.json({ message: 'Medicamento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar medicamento', error: error.message });
    }
};

// Inserción masiva: espera un array de objetos medicamento en body.items
exports.insertarMasivo = async (req, res) => {
    try {
        const items = Array.isArray(req.body?.items) ? req.body.items : [];
        if (!items.length) return res.status(400).json({ message: 'No hay items para insertar' });

        // Insertar evitando duplicados simples por nombre+dosis+presentacion+laboratorio
        const toInsert = [];
        const seen = new Set();
        for (const it of items) {
            const key = [it.nombre, it.dosis, it.presentacion, it.laboratorio].map(x => (x||'').toLowerCase().trim()).join('|');
            if (seen.has(key)) continue;
            seen.add(key);
            toInsert.push(it);
        }

        const result = await Medicamento.insertMany(toInsert, { ordered: false });
        res.status(201).json({ message: 'Inserción masiva completada', insertados: result.length });
    } catch (error) {
        // insertMany con ordered:false puede lanzar errores por duplicados; devolver contados si existen docs insertados
        if (error?.insertedDocs) {
            return res.status(201).json({ message: 'Inserción parcial', insertados: error.insertedDocs.length });
        }
        res.status(500).json({ message: 'Error en inserción masiva', error: error.message });
    }
};