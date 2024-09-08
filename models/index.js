
const { Sequelize } = require('sequelize');
const User = require('./User');
const Estudiante = require('./Estudiante');
const Profesor = require('./Profesor');
const Curso = require('./Curso');
const CursoEstudiante = require('./CursoEstudiante');


// Configuración de la conexión
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Ajusta la ruta a tu base de datos
    logging: false // Desactiva el registro SQL si no lo necesitas
});

// Inicializar modelos y relaciones
const initializeModels = async () => {
    // Definir relaciones
    User.hasOne(Estudiante, { foreignKey: 'user_id' });
    Estudiante.belongsTo(User, { foreignKey: 'user_id' });

    User.hasOne(Profesor, { foreignKey: 'user_id' });
    Profesor.belongsTo(User, { foreignKey: 'user_id' });

    Curso.hasMany(CursoEstudiante, { foreignKey: 'Curso_id' });
    Estudiante.hasMany(CursoEstudiante, { foreignKey: 'Estudiante_id' });

    CursoEstudiante.belongsTo(Curso, { foreignKey: 'Curso_id' });
    CursoEstudiante.belongsTo(Estudiante, { foreignKey: 'Estudiante_id' });

    // Sincronizar modelos con la base de datos
    try {
        await sequelize.sync({ alter: true }); // Utiliza { force: true } para actualizar la base de datos automáticamente
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('Error al sincronizar modelos:', error);
    }
};

initializeModels();

module.exports = {
    sequelize,
    User,
    Estudiante,
    Profesor,
    Curso,
    CursoEstudiante
};
