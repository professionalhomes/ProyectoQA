const express = require('express');
const path = require('path');
const authController = require('../controllers/authController'); // Asegúrate de que esta ruta sea correcta
const cursoController = require('../controllers/cursosController');
const router = express.Router();

// Página de inicio de sesión
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

// Procesar inicio de sesión
router.post('/login', authController.login); // Asegúrate de que authController.login esté definido

// Página de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

// Página de Dashboard
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

router.get('/student/my-appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'mis-citas.html'));
});

// Opciones del administrador
router.get('/admin/courses', async (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'gestionar-cursos.html'));
});

router.get('/admin/professors', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'asignar-profesor.html'));
});

router.get('/admin/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'asignar-estudiantes.html'));
});

router.get('/admin/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-settings.html'));
});  // <-- Aquí estaba el paréntesis faltante

router.get('/admin/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-reports.html'));
});

// API para obtener datos 
router.get('/api/user-info', (req, res) => {
    res.json({ name: req.user.nombre, role: req.user.role }); // Envía datos JSON
});

router.get('/admin/courses', async (req, res) => {
    const estudiantes = await Estudiante.findAll(); // Obtener la lista de estudiantes desde la base de datos
    res.render('asignar-curso', { estudiantes }); // Renderiza la vista con la lista de estudiantes
});

// Procesar solicitudes POST
router.post('/dashboard', authController.register);
// Procesar la asignación de un profesor a un curso
router.post('/professor/availability', authController.register);
router.post('/student/appointments', authController.register);
router.post('/solicitar-cita', authController.register);
router.post('/register', authController.register);

// Cerrar sesión
router.get('/logout', authController.logout); // Asegúrate de que authController.logout esté definido

module.exports = router;
