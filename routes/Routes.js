const express = require('express');
const path = require('path');
const authController = require('../controllers/authController'); // Aseg�rate de que esta ruta sea correcta
const cursosController = require('../controllers/cursosController');
const Profesor = require('../models/Profesor'); // Asegúrate de que el modelo Profesor esté bien importado
const Estudiante = require('../models/Estudiante');
const router = express.Router();
const reportController = require('../controllers/generarReporte');
// P�gina de inicio de sesi�n
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});
// Procesar inicio de sesi�n
router.post('/login', authController.login); // Aseg�rate de que authController.login est� definido
// P�gina de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});
// P�gina de Dashboard
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});
// Opciones del profesor
router.get('/professor/availability', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'crear-cita.html'));
});
router.get('/professor/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'ver-citas.html'));
});
router.get('/professor/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'ver-estudiantes.html'));
});
// Opciones del estudiante
router.get('/student/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'solicitar-cita.html'));
});
// Opciones del administrador
router.get('/admin/courses', async (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'GestiónCursos.html'));
});
router.get('/admin/professors', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'asignar-profesor.html'));
});
router.get('/admin/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'asignar-estudiantes.html'));
});
router.get('/admin/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-settings.html'));
});  // <-- Aqu� estaba el par�ntesis faltante

router.get('/admin/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'reportesAdministrador.html'));
});
// API para obtener datos 
router.get('/api/user-info', (req, res) => {
    res.json({ name: req.user.nombre, role: req.user.role }); // Env�a datos JSON
});
router.get('/admin/courses', async (req, res) => {
    const estudiantes = await Estudiante.findAll(); // Obtener la lista de estudiantes desde la base de datos
    res.render('asignar-curso', { estudiantes }); // Renderiza la vista con la lista de estudiantes
});
// Ruta para generar y descargar el reporte
//router.get('/descargar-reporte',reportController.generarReporte);


/////////////////////////////////////////////////////////////
//const { Curso, Profesor } = require('../models'); // Asegúrate de que las importaciones coincidan con tus nombres de archivos y exportaciones

// Ruta para obtener cursos
router.get('/api/cursos', async (req, res) => {
    try {
        const cursos = await Curso.findAll({
            attributes: ['id', 'name'] // Asegúrate de que estos campos existen en tu modelo
        });
        res.json(cursos);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).send(error);
    }
});

// Ruta para obtener profesores
router.get('/api/profesores', async (req, res) => {
    try {
        const profesores = await Profesor.findAll({
            attributes: ['id', 'nombre'] // Asegúrate de que estos campos existen en tu modelo
        });
        res.json(profesores);
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).send(error);
    }
});

////////////////////////////////////////////////////////////////////////

// Procesar solicitudes POST
router.post('/dashboard', authController.register);
router.post('/crear-curso', cursosController.createCourse);
router.get('/profesores', cursosController.getProfessors);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.post('/generar-reporte', reportController.generarReporte);
module.exports = router;