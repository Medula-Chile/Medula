const CentroSalud = require('../models/centroSalud');

exports.crearCentro = async (req, res) => {
    try {
        const nuevoCentro = new CentroSalud(req.body);
        const centroGuardado = await nuevoCentro.save();

        // Populate después de guardar para retornar datos completos
        const centroConEspecialidades = await CentroSalud.findById(centroGuardado._id)
            .populate('especialidades', 'nombre descripcion area_clinica');

        res.status(201).json({
            message: 'Centro de salud creado exitosamente',
            centro: centroConEspecialidades
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
        const centros = await CentroSalud.find()
            .populate('especialidades', 'nombre descripcion area_clinica activo')
            .sort({ nombre: 1 });
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
        const centro = await CentroSalud.findById(req.params.id)
            .populate('especialidades', 'nombre descripcion area_clinica activo');

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
        ).populate('especialidades', 'nombre descripcion area_clinica activo');

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

        // Populate después de guardar
        const centroConEspecialidades = await CentroSalud.findById(centroActualizado._id)
            .populate('especialidades', 'nombre descripcion area_clinica activo');

        res.json({
            message: `Centro de salud ${centroConEspecialidades.activo ? 'activado' : 'desactivado'} exitosamente`,
            centro: centroConEspecialidades
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
        
        // Búsqueda que incluye especialidades populadas
        const centros = await CentroSalud.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { direccion: { $regex: query, $options: 'i' } },
                { comuna: { $regex: query, $options: 'i' } },
                { telefono: { $regex: query, $options: 'i' } },
                { region: { $regex: query, $options: 'i' } },
                { tipo: { $regex: query, $options: 'i' } }
            ]
        })
        .populate({
            path: 'especialidades',
            select: 'nombre descripcion area_clinica activo',
            match: { 
                $or: [
                    { nombre: { $regex: query, $options: 'i' } },
                    { descripcion: { $regex: query, $options: 'i' } },
                    { area_clinica: { $regex: query, $options: 'i' } }
                ]
            }
        })
        .sort({ nombre: 1 });

        // Filtrar centros que tengan especialidades que coincidan con la búsqueda
        const centrosFiltrados = centros.filter(centro => {
            // Si el centro mismo coincide, incluirlo
            const centroCoincide = 
                centro.nombre.match(new RegExp(query, 'i')) ||
                centro.direccion.match(new RegExp(query, 'i')) ||
                centro.comuna.match(new RegExp(query, 'i')) ||
                centro.telefono.match(new RegExp(query, 'i')) ||
                centro.region.match(new RegExp(query, 'i')) ||
                centro.tipo.match(new RegExp(query, 'i'));

            // Si tiene especialidades que coinciden, incluirlo
            const especialidadesCoinciden = centro.especialidades && 
                centro.especialidades.some(esp => 
                    esp && esp.nombre && esp.nombre.match(new RegExp(query, 'i'))
                );

            return centroCoincide || especialidadesCoinciden;
        });

        res.json(centrosFiltrados);
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar centros de salud',
            error: error.message
        });
    }
};

// Nuevo método para obtener centros por especialidad
exports.obtenerCentrosPorEspecialidad = async (req, res) => {
    try {
        const { especialidadId } = req.params;
        
        const centros = await CentroSalud.find({
            especialidades: especialidadId,
            activo: true
        })
        .populate('especialidades', 'nombre descripcion area_clinica')
        .sort({ nombre: 1 });

        res.json(centros);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener centros por especialidad',
            error: error.message
        });
    }
};

// Agregar este método al centroController.js
exports.crearCentrosBulk = async (req, res) => {
    try {
        const { centros } = req.body;
        
        if (!centros || !Array.isArray(centros)) {
            return res.status(400).json({
                message: 'Se requiere un array de centros en el cuerpo de la petición'
            });
        }

        const centrosCreados = [];
        const errores = [];

        // Insertar centros uno por uno para manejar errores individualmente
        for (const centroData of centros) {
            try {
                const nuevoCentro = new CentroSalud(centroData);
                const centroGuardado = await nuevoCentro.save();
                
                // Populate después de guardar
                const centroConEspecialidades = await CentroSalud.findById(centroGuardado._id)
                    .populate('especialidades', 'nombre descripcion area_clinica');
                
                centrosCreados.push(centroConEspecialidades);
            } catch (error) {
                errores.push({
                    centro: centroData.nombre,
                    error: error.message
                });
            }
        }

        res.status(201).json({
            message: `Proceso completado. ${centrosCreados.length} centros creados exitosamente`,
            centrosCreados: centrosCreados.length,
            centrosConError: errores.length,
            centros: centrosCreados,
            errores: errores
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al crear centros en lote',
            error: error.message
        });
    }
};