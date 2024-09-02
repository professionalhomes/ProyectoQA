const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const CursoEstudiante = require('./CursoEstudiante');
const Curso = require('./Curso');

const Estudiante = sequelize.define('Estudiante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    carnet: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estrellas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 3
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'Estudiantes'
});


module.exports = Estudiante;