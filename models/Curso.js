// models/Curso.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Profesor = require('./Profesor');

const Curso = sequelize.define('Curso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    start_date: {
        type: DataTypes.DATE,
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
    timestamps: true
});

// Definir la relación
Curso.belongsTo(Profesor, { foreignKey: 'Profesor_id', as: 'profesor' });

module.exports = Curso;
