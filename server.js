const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');



const Routes = require('./routes/Routes');


// Importar otras rutas si es necesario

// Conectar a la base de datos
connectDB();

const app = express();

// Configuración de middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: 'secreto_para_el_sistema_de_autenticacion',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Configurar Passport
require('./config/passport')(passport);

// Registrar rutas
app.use('/', Routes);
// Registrar otras rutas si es necesario

// Ruta principal
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
