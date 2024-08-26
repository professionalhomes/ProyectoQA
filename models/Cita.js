const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
    estudianteId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    },
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
    disponibilidadId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Disponibilidades',
            key: 'id'
        },
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    reservada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'citas',
    timestamps: false
});

module.exports = Cita;
