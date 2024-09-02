// utils/gestorPrioridades.js
const { Cita, Estudiante, Curso } = require('../models');

// Función principal para asignar la mejor cita según la prioridad
async function asignarCita(estudianteId, cursoId) {
    const estudiante = await Estudiante.findByPk(estudianteId);
    const curso = await Curso.findByPk(cursoId, { include: [Profesor] });

    if (!estudiante || !curso) {
        throw new Error('Estudiante o Curso no encontrado');
    }
    const citasDisponibles = await Cita.findAll({
        where: {
            cursoId,
            reservada: false, // Solo consideramos citas no reservadas
        },
        order: [['fecha', 'ASC']],
    });
    if (citasDisponibles.length === 0) {
        throw new Error('No hay citas disponibles');
    }
    let mejorCita = null;
    for (const cita of citasDisponibles) {
        const prioridad = calcularPrioridad(estudiante, curso, cita);
        cita.prioridad = prioridad;

        if (!mejorCita || cita.prioridad < mejorCita.prioridad) {
            mejorCita = cita;
        }
    }
    if (mejorCita) {
        mejorCita.reservada = true;
        mejorCita.estudianteId = estudianteId;
        await mejorCita.save();
    }
    return mejorCita;
}

// Función para calcular la prioridad de una cita
function calcularPrioridad(estudiante, curso, cita) {
    let prioridad = 0;

    const vecesLlevado = obtenerVecesCursoLlevado(estudiante, curso);
    const estrellas = estudiante.estrellas;
    const tasaDisponibilidad = calcularTasaDisponibilidad(curso);

    if (vecesLlevado === 0) {
        if (estrellas === 1) {
            prioridad = 1;
        } else if (estrellas === 2) {
            prioridad = tasaDisponibilidad >= 70 ? 2 : 3;
        } else if (estrellas === 3) {
            prioridad = tasaDisponibilidad >= 50 ? 2 : 3;
        }
    } else if (vecesLlevado === 1) {
        if (estrellas === 1) {
            prioridad = 1;
        } else if (estrellas === 2) {
            prioridad = tasaDisponibilidad >= 50 ? 1 : 2;
        } else if (estrellas === 3) {
            prioridad = 1;
        }
    } else if (vecesLlevado >= 2) {
        if (estrellas === 1) {
            prioridad = 1;
        } else if (estrellas === 2) {
            prioridad = tasaDisponibilidad >= 35 ? 1 : 2;
        } else if (estrellas === 3) {
            prioridad = 1;
        }
    }

    return prioridad;
}

// Ejemplo de función para obtener cuántas veces el estudiante ha llevado el curso
function obtenerVecesCursoLlevado(estudiante, curso) {
    // Aquí puedes implementar la lógica para contar las veces que un estudiante ha llevado un curso
    // Podría ser un contador en el modelo CursoEstudiante o basado en el historial de cursos del estudiante
    return estudiante.Cursos.filter(c => c.id === curso.id).length;
}

// Ejemplo de función para calcular la tasa de disponibilidad del curso
function calcularTasaDisponibilidad(curso) {
    // Aquí puedes calcular la tasa de disponibilidad de las citas del curso
    const totalCitas = curso.Citas.length;
    const citasReservadas = curso.Citas.filter(c => c.reservada).length;
    return (citasReservadas / totalCitas) * 100;
}

module.exports = {
    asignarCita,
};
