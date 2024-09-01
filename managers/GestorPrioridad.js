const {
    ReglaPrioridad0Estrella1,
    ReglaPrioridad0Estrella2,
    ReglaPrioridad1Estrella1,
    ReglaPrioridad1Estrella3
} = require('../models/ReglaPrioridad');

class GestorPrioridad {
    constructor() {
        this.reglas = {
            '0-1': new ReglaPrioridad0Estrella1(),
            '0-2': new ReglaPrioridad0Estrella2(),
            '1-1': new ReglaPrioridad1Estrella1(),
            '1-3': new ReglaPrioridad1Estrella3(),
            // Añadir más reglas aquí
        };
    }

    obtenerRegla(vecesLlevado, estrellas) {
        return this.reglas[`${vecesLlevado}-${estrellas}`];
    }
}

module.exports = GestorPrioridad;