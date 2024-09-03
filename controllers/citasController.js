

const Curso = require('../models/Curso');
const { Sequelize } = require('sequelize'); 
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

        const citaPendiente = await Cita.findOne({
            where: { estudianteId: estudiante.id, estado: 'pendiente' }
        });
        if (citaPendiente) {
            return res.status(400).json({ error: 'Ya tienes una solicitud de cita pendiente.' });
        }

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

        console.log('D:', tasaDisponibilidad);

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
                    duracion: 0,
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


const obtenerCitasDelProfesor = async (req, res) => {
    try {
        const { cursoId } = req.body;

        console.log('Curso ID:', cursoId);

        // Paso 1: Encuentra todas las disponibilidades para el curso
        const disponibilidades = await Disponibilidad.findAll({
            where: { cursoId: cursoId },
        });

        console.log('Disponibilidades:', disponibilidades);

        // Extrae los IDs de las disponibilidades
        const disponibilidadIds = disponibilidades.map(d => d.id);

        // Paso 2: Encuentra todas las citas correspondientes a las disponibilidades
        const citas = await Cita.findAll({
            where: { disponibilidadId: disponibilidadIds, estado: 'pendiente' },
        });

        console.log('Citas:', citas);

        // Extrae los IDs de los estudiantes
        const estudianteIds = [...new Set(citas.map(c => c.estudianteId))];

        // Paso 3: Encuentra los estudiantes correspondientes a los IDs
        const estudiantes = await Estudiante.findAll({
            where: { id: estudianteIds },
        });

        // Crear un mapa de estudiantes por ID para un acceso rápido
        const estudiantesMap = estudiantes.reduce((acc, est) => {
            acc[est.id] = est;
            return acc;
        }, {});

        // Combinar información de citas con estudiantes
        const citasConEstudiantes = citas.map(cita => ({
            ...cita.dataValues,
            estudiante: estudiantesMap[cita.estudianteId],
        }));

        // Mostrar la información en la consola
        citasConEstudiantes.forEach(cita => {
            console.log('Cita ID:', cita.id);
            console.log('Estudiante ID:', cita.estudianteId);
            console.log('Disponibilidad ID:', cita.disponibilidadId);
            console.log('Reservada:', cita.reservada);
            console.log('Fecha:', new Date(cita.fecha).toLocaleString());
            console.log('Duración:', cita.duracion);
            console.log('Prioridad:', cita.prioridad);
            console.log('Estado:', cita.estado);
            console.log('Estudiante Nombre:', cita.estudiante.nombre);
            console.log('Estudiante Carnet:', cita.estudiante.carnet);
            console.log('Estudiante Estrellas:', cita.estudiante.estrellas);
            console.log('----------------------------');
        });

        // Opcionalmente, responder con los datos para la vista
        res.json(citasConEstudiantes);
    } catch (error) {
        console.error('Error al obtener citas del profesor:', error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
};
const aceptarCita = async (req, res) => {
    try {
        const cita = await Cita.findByPk(req.params.id);
        const disponibilidad = await Disponibilidad.findByPk(cita.disponibilidadId);

        // Incrementar el contador de citas y reiniciar si supera cantidadCitas
        disponibilidad.Citas += 1;
        if (disponibilidad.Citas > disponibilidad.cantidadCitas) {
            disponibilidad.Citas = 1; // Reiniciar el contador
        }

        // Buscar citas existentes en la misma disponibilidad
        const citasExistentes = await Cita.findAll({
            where: {
                disponibilidadId: disponibilidad.id,
                estado: 'aceptada',
            },
            order: [['fecha', 'DESC']]
        });

        // Calcular la fecha y hora para la nueva cita
        let fechaCita = new Date(`${disponibilidad.dia}T${disponibilidad.horaInicio}`);

        if (citasExistentes.length > 0) {
            // Si hay una cita anterior, añadir 10 minutos
            const ultimaCita = citasExistentes[0];
            const nuevaFecha = new Date(ultimaCita.fecha);
            nuevaFecha.setMinutes(nuevaFecha.getMinutes() + 10);

            // Si la nueva fecha se excede del horario disponible, moverla a la semana siguiente
            const horaFin = new Date(`${disponibilidad.dia}T${disponibilidad.horaFin}`);
            if (nuevaFecha > horaFin) {
                nuevaFecha.setDate(nuevaFecha.getDate() + 7); // Mover a la semana siguiente
                nuevaFecha.setHours(horaFin.getHours(), horaFin.getMinutes()); // Ajustar la hora dentro de la ventana permitida
            }
            fechaCita = nuevaFecha;
        }

        // Asignar la fecha calculada a la cita
        cita.fecha = fechaCita;

        // Cambiar el estado a "aceptada"
        cita.estado = 'aceptada';

        // Guardar las modificaciones
        await disponibilidad.save();
        await cita.save();

        res.redirect('/profesor/citas');
    } catch (error) {
        console.error('Error al aceptar cita:', error);
        res.status(500).send('Error al aceptar cita');
    }
};

const rechazarCita = async (req, res) => {
    try {
        const cita = await Cita.findByPk(req.params.id);
        if (!cita) {
            return res.status(404).send('Cita no encontrada');
        }
        cita.estado = 'rechazada';
        await cita.save();
        res.redirect('/professor/students');
    } catch (error) {
        console.error('Error al rechazar cita:', error);
        res.status(500).send('Error al rechazar cita');
    }
};
module.exports = {
    solicitarCita,
    obtenerCitasDelProfesor,
    aceptarCita,
    rechazarCita,
};