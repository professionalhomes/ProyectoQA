const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Profesor = require('./Profesor'); // Import Estudiante
const CursoEstudiante = require('./CursoEstudiante'); // Import CursoEstudianteconst CursoEstudiante = require('./CursoEstudiante');
const Estudiante = require('./Estudiante');

const Curso = sequelize.define('Curso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    codigo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    semester: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Profesor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Profesor,
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'Cursos'
});

// Define associations
Curso.belongsTo(Profesor, { foreignKey: 'Profesor_id', as: 'profesor' });



module.exports = Curso;
