const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Verifica que la ruta sea correcta
const passport = require('passport');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'carnet'
    }, async (carnet, password, done) => {
        try {
            // Buscar el usuario usando el campo carnet
            const user = await User.findOne({ where: { carnet } });

            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            // Comparar la contraseña proporcionada con la almacenada en la base de datos
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            // Usuario autenticado correctamente
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        // Guardar el ID del usuario en la sesión
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            // Buscar el usuario por ID
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
