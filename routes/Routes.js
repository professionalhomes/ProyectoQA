const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');
const cursosController = require('../controllers/cursosController');
const EstudianteController = require('../controllers/estudianteController');
const EstudiantecursoController = require('../controllers/CursoEstudianteController');
const DisponibilidadController = require('../controllers/disponibilidadController');
const solicitarCitaController = require('../controllers/citasController');
const reportController = require('../controllers/generarReporte');
const router = express.Router();

// Páginas
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/login', authController.login);

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

router.get('/professor/availability', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'CrearDisponibilidad.html'));
});

router.get('/professor/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'ver-citas.html'));
});

router.get('/professor/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'Solicitudes.html'));
});

router.get('/student/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'SolicitarCita.html'));
});

router.get('/student/my-appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'SolicitudesEstudiantes.html'));
});

router.get('/admin/courses', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'GestiónCursos.html'));
});

router.get('/admin/estrella', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'GestionEstrellas.html'));
});

router.get('/admin/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'AsignarEstudiante.html'));
});

router.get('/admin/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-settings.html'));
});

router.get('/admin/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'reportesAdministrador.html'));
});


// API para obtener datos
router.get('/api/user-info', (req, res) => {
    res.json({ id: req.user.id, name: req.user.nombre, role: req.user.role });
});

// Procesar solicitudes POST
router.post('/Solicitar', solicitarCitaController.obtenerCitasDelProfesor);
router.post('/citasestudiante', solicitarCitaController.obtenerCitasDelEstudiante);
router.post('/citas/:id/aceptar', solicitarCitaController.aceptarCita);
router.post('/citas/:id/rechazar', solicitarCitaController.rechazarCita);
router.post('/dashboard', authController.register);
router.post('/crear-curso', cursosController.createCourse);
router.get('/cursos', cursosController.getCourses);
router.get('/profesores', cursosController.getProfessors);
router.get('/estudiantes', EstudianteController.getStudents);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.post('/asignar', EstudiantecursoController.assignStudentsToCourse);
router.get('/cursoprofesor', DisponibilidadController.getCursosPorProfesor);
router.get('/cursoestudiante/:userId', EstudianteController.getCursosPorEstudiante);
router.get('/Usuario', DisponibilidadController.getProfesorIdByUserId);
router.post('/disponibilidad', DisponibilidadController.createDisponibilidad);
router.post('/cambiarestrella', EstudianteController.updateEstrellas);
router.post('/solicitar-cita', solicitarCitaController.solicitarCita);
router.post('/generar-reporte', reportController.generarReporte);


module.exports = router;
