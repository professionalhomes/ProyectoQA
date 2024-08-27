
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CursoEstudiante = sequelize.define('CursoEstudiante', {
    Curso_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Curso', // nombre de la tabla en la base de datos
            key: 'id'
        },
        allowNull: false
    },
    Estudiante_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Estudiante', // nombre de la tabla en la base de datos
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = CursoEstudiante;
