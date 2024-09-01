
const { Disponibilidad, Estudiante } = require('../models'); // Asegúrate de tener el modelo correcto
const GestorPrioridad = require('../managers/GestorPrioridad');

async function calcularPrioridad(cursoEstudiante, estudianteId) {
    const { vecesLlevado } = cursoEstudiante;
    const estudiante = await Estudiante.findByPk(estudianteId);
    const estrellas = estudiante.estrellas;

    // Obtener todas las disponibilidades para el curso
    const disponibilidades = await Disponibilidad.findAll({
        where: { cursoId: cursoEstudiante.Curso_id },
        order: [['dia', 'ASC'], ['horaInicio', 'ASC']]
    });

    const gestorPrioridad = new GestorPrioridad();

    // Buscar la cita según la prioridad
    for (const disponibilidad of disponibilidades) {
        const { dia, horaInicio } = disponibilidad;
        const tasaDisponibilidad = calcularTasaDisponibilidad(dia, horaInicio);
        const regla = gestorPrioridad.obtenerRegla(vecesLlevado, estrellas);

        if (regla.aplicar(disponibilidad, estudiante, tasaDisponibilidad)) {
            return disponibilidad;
        }
    }

    // Si no hay cita disponible según las reglas, puedes definir qué hacer aquí
    return null;
}

function calcularTasaDisponibilidad(dia, horaInicio) {
    // Aquí debes implementar la lógica para calcular la tasa de disponibilidad
    // Supongamos que tienes un modelo o función que te da el total y reservado
    const totalCitas = 10; // Ejemplo, sustituir con datos reales
    const citasReservadas = 5; // Ejemplo, sustituir con datos reales
    return (citasReservadas / totalCitas) * 100;
}

module.exports = { calcularPrioridad };
