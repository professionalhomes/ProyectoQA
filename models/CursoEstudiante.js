// models/CursoEstudiante.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Curso = require('./Curso');
const Estudiante = require('./Estudiante');

const CursoEstudiante = sequelize.define('CursoEstudiante', {
    Curso_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Cursos', // Asegúrate de que el nombre de la tabla coincida
            key: 'id'
        },
        allowNull: false
    },
    Estudiante_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Estudiantes', // Asegúrate de que el nombre de la tabla coincida
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'CursoEstudiantes'
});

module.exports = CursoEstudiante;
