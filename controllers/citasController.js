

const Curso = require('../models/Curso');
const Estudiante = require('../models/Estudiante');
const CursoEstudiantes = require('../models/CursoEstudiante');
const Disponibilidad = require('../models/Disponibilidad');
const Cita = require('../models/Cita');

const calcularPrioridad = (vecesCurso, estrellasEstudiante, tasaDisponibilidad) => {
    if (estrellasEstudiante === 1) {
        if (vecesCurso === 0) {
            if (tasaDisponibilidad >= 70) return 1; // Caso de tasa >= 70%
            return 2; // Caso sin tasa >= 70%
        }
        if (vecesCurso === 1) {
            if (tasaDisponibilidad >= 50) return 2; // Caso de tasa >= 50%
            return 3; // Caso sin tasa >= 50%
        }
        if (vecesCurso >= 2) {
            if (tasaDisponibilidad >= 35) return 2; // Caso de tasa >= 35%
            return 3; // Caso sin tasa >= 35%
        }
    }
    if (estrellasEstudiante === 2) {
        if (vecesCurso === 0) {
            if (tasaDisponibilidad >= 70) return 1; // Caso de tasa >= 70%
            return 2; // Caso sin tasa >= 70%
        }
        if (vecesCurso === 1) {
            if (tasaDisponibilidad >= 50) return 2; // Caso de tasa >= 50%
            return 3; // Caso sin tasa >= 50%
        }
        if (vecesCurso >= 2) {
            if (tasaDisponibilidad >= 35) return 2; // Caso de tasa >= 35%
            return 3; // Caso sin tasa >= 35%
        }
    }
    return 4; // Por defecto, asignar la menor prioridad
};
const solicitarCita = async (req, res) => {
    try {
        const { userData, data } = req.body;
        console.log('A:', req.body);
        console.log('A2:', data.cursoId);

        const estudiante = await Estudiante.findOne({ where: { user_id: userData.id } });
        if (!estudiante) return res.status(404).json({ error: 'Estudiante no encontrado' });

        

        console.log('B1:', estudiante.id);

        const cursosEstudiante = await CursoEstudiantes.findOne({
            where: { Estudiante_id: estudiante.id, Curso_id: data.cursoId }
        });

        if (!cursosEstudiante) return res.status(404).json({ error: 'Curso no encontrado para el estudiante' });
        console.log('C:', cursosEstudiante.Curso_id);
        

        const disponibilidades = await Disponibilidad.findAll({
            where: { cursoId: cursosEstudiante.Curso_id },
        });
        const tasaDisponibilidad = disponibilidades.reduce((total, disponibilidad) => {
            return total + (disponibilidad.Citas / disponibilidad.cantidadCitas) * 100;
        }, 0) / disponibilidades.length;
        console.log('D:',  tasaDisponibilidad );
        const prioridad = calcularPrioridad(cursosEstudiante.vecesCurso, estudiante.estrellas, tasaDisponibilidad);
        console.log('E:', prioridad);
        const cursoIds = disponibilidades.map(disponibilidades => disponibilidades.Citas);
        console.log('F:', cursoIds);
        for (const disponibilidad of disponibilidades) {
            if (disponibilidad.Citas < disponibilidad.cantidadCitas) {
                const nuevaCita = await Cita.create({
                    estudianteId: estudiante.id,
                    disponibilidadId: disponibilidad.id,
                    fecha: new Date(), // Ajustar según tu lógica
                    duracion: 15,
                    prioridad: prioridad
                });
                nuevaCita.reservada = true;
                await nuevaCita.save();
                return res.json(nuevaCita);
            }
        }
        return res.status(404).json({ error: 'No hay citas disponibles' });
    } catch (error) {
        console.error('Error al solicitar cita:', error);
        res.status(500).json({ error: 'Error al solicitar cita' });
    }
};
module.exports = { solicitarCita };