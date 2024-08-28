// associations.js
const User = require('./User');
const Estudiante = require('./Estudiante');
const Profesor = require('./Profesor');
const Curso = require('./Curso');


// Relaciones
User.hasOne(Estudiante, { foreignKey: 'user_id' });
Estudiante.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Profesor, { foreignKey: 'user_id' });
Profesor.belongsTo(User, { foreignKey: 'user_id' });
