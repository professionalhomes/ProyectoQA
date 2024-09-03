const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Disponibilidades = require('./Disponibilidad'); 

const Cita = sequelize.define('Cita', {
    estudianteId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Estudiantes',
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE', // Elimina la cita si se elimina el estudiante
    },
    disponibilidadId: {
        type: DataTypes.INTEGER,
        references: {
            model: Disponibilidades,
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE', // Elimina la cita si se elimina el estudiante
    },
    reservada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    prioridad: {
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER, // Duración en minutos
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado de la cita',
    },
}, {
    tableName: 'citas',
    timestamps: true, // Incluye createdAt y updatedAt automáticamente
    paranoid: true, // Incluye deletedAt para borrado suave
});

module.exports = Cita;