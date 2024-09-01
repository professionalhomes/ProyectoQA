const { calcularPrioridad } = require('../services/servicioCitas');
const { Cita, Estudiante } = require('../models'); // Asegúrate de tener el modelo correcto

exports.solicitarCita = async (req, res) => {
    const { estudianteId, cursoId } = req.body;

    try {
        // Obtén el registro del estudiante y el curso
        const estudiante = await Estudiante.findByPk(estudianteId);
        const cursoEstudiante = await CursoEstudiante.findOne({ where: { Curso_id: cursoId, Estudiante_id: estudianteId } });

        if (!estudiante || !cursoEstudiante) {
            return res.status(404).json({ error: 'Estudiante o curso no encontrado' });
        }

        // Calcula la prioridad para la cita
        const disponibilidad = await calcularPrioridad(cursoEstudiante, estudianteId);

        if (disponibilidad) {
            // Crear cita en el sistema
            const nuevaCita = await Cita.create({
                estudianteId,
                cursoId,
                disponibilidadId: disponibilidad.id,
                fecha: disponibilidad.dia,
                hora: disponibilidad.horaInicio
            });

            // Notificar al estudiante
            res.status(201).json({
                message: `Cita asignada para el ${disponibilidad.dia} a las ${disponibilidad.horaInicio}`,
                cita: nuevaCita
            });
        } else {
            res.status(404).json({ message: 'No hay citas disponibles según la prioridad' });
        }
    } catch (error) {
        console.error('Error al solicitar cita:', error);
        res.status(500).json({ error: 'Error al solicitar cita', message: error.message });
    }
};