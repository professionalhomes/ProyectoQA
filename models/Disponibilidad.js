const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Disponibilidad = sequelize.define('Disponibilidad', {
    profesorId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    },
    cursoId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Cursos',
            key: 'id'
        },
        allowNull: false
    },
    dia: {
        type: DataTypes.STRING,  
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    cantidadCitas: {
        type: DataTypes.INTEGER, 
        allowNull: false
    }
}, {
    tableName: 'disponibilidades',
    timestamps: false
});

module.exports = Disponibilidad;
