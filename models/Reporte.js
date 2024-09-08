const sqlite3 = require('sqlite3').verbose();

// Crear una clase para manejar los reportes
class Reporte {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error al abrir la base de datos', err);
            } else {
                console.log('Conectado a la base de datos SQLite.');
            }
        });
    }

    // Método para obtener todos los datos necesarios para el reporte
    obtenerDatosReporte(callback) {
        const sql = 'SELECT * FROM tabla_datos_reporte'; // Asegúrate de cambiar 'tabla_datos_reporte' al nombre de tu tabla real
        this.db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    // Cierra la conexión a la base de datos
    cerrarConexion() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Cierre de la conexión a la base de datos.');
        });
    }
}

module.exports = Reporte;