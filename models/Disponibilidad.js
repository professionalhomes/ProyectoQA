const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Cursos = require('./Curso');
const User = require('./User');


const Disponibilidad = sequelize.define('Disponibilidad', {
    profesorId: {
        type: DataTypes.INTEGER,
        references: {
            model: User ,
            key: 'id'
        },
        allowNull: false
    },
    cursoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cursos,
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
    Citas:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
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
Disponibilidad.associate = (models) => {
    // Define la asociación con Cita
    Disponibilidad.hasMany(models.Cita, {
        foreignKey: 'disponibilidadId',
        as: 'Citas'
    });
};

module.exports = Disponibilidad;
