
class ReglaPrioridad {
    aplicar(disponibilidad, estudiante, tasaDisponibilidad) {
        throw new Error('Método "aplicar" debe ser implementado');
    }
}

class ReglaPrioridad0Estrella1 extends ReglaPrioridad {
    aplicar(disponibilidad, estudiante, tasaDisponibilidad) {
        return !disponibilidad.reservada || tasaDisponibilidad >= 70;
    }
}

class ReglaPrioridad0Estrella2 extends ReglaPrioridad {
    aplicar(disponibilidad, estudiante, tasaDisponibilidad) {
        return !disponibilidad.reservada || tasaDisponibilidad >= 50;
    }
}

class ReglaPrioridad1Estrella1 extends ReglaPrioridad {
    aplicar(disponibilidad, estudiante, tasaDisponibilidad) {
        return !disponibilidad.reservada || tasaDisponibilidad >= 50;
    }
}

class ReglaPrioridad1Estrella3 extends ReglaPrioridad {
    aplicar(disponibilidad, estudiante, tasaDisponibilidad) {
        return tasaDisponibilidad >= 70;
    }
}

// Puedes añadir más reglas según sea necesario

module.exports = {
    ReglaPrioridad0Estrella1,
    ReglaPrioridad0Estrella2,
    ReglaPrioridad1Estrella1,
    ReglaPrioridad1Estrella3,
};
