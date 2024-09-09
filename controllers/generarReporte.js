const { sequelize } = require('../config/db');
const pdfkit = require('pdfkit');
const path = require('path');
const fs = require('fs');
const os = require('os'); // Para manejar archivos temporales

exports.generarReporte = async (req, res) => {
    try {
        const { estudiante, reserved, course, professor, day } = req.body; // Añadir los nuevos parámetros

        // Crear condiciones dinámicas para la consulta SQL
        let whereConditions = [];
        let replacements = {};

        // Filtrar por estudiante
        if (estudiante && estudiante !== 'todos') {
            whereConditions.push('C.estudianteId = :estudiante');
            replacements.estudiante = estudiante;
        }

        // Filtrar por tipo de cita (estado)
        if (reserved && reserved !== 'todos') {
            whereConditions.push('C.estado = :reserved');
            replacements.reserved = reserved;
        }

        // Filtrar por curso
        if (course && course !== 'todos') {
            whereConditions.push('Cu.id = :course');
            replacements.course = course;
        }

        // Filtrar por profesor
        if (professor && professor !== 'todos') {
            whereConditions.push('P.id = :professor');
            replacements.professor = professor;
        }

        // Filtrar por día
        if (day && day !== 'todos') {
            whereConditions.push('D.dia = :day');
            replacements.day = day;
        }

        const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Consulta SQL para obtener los datos del reporte
        const query = `
            SELECT 
                C.fecha, 
                C.duracion, 
                C.estado, 
                C.prioridad, 
                E.nombre AS estudianteNombre, 
                E.carnet AS estudianteCarnet, 
                E.estrellas AS estudianteEstrellas, 
                D.dia, 
                D.horaInicio, 
                D.horaFin, 
                D.Citas, 
                D.cantidadCitas, 
                Cu.codigo AS cursoCodigo, 
                Cu.name AS cursoNombre, 
                P.nombre AS profesorNombre
            FROM 
                citas C
            JOIN 
                Estudiantes E ON C.Id = E.id
            JOIN 
                disponibilidades D ON C.Id = D.id
            JOIN 
                Cursos Cu ON D.Id = Cu.id
            JOIN 
                profesores P ON D.Id = P.id
            ${whereClause}
            ORDER BY 
                C.fecha ASC
        `;

        // Ejecutar la consulta SQL
        const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: replacements
        });

        if (!Array.isArray(results)) {
            throw new Error('El resultado de la consulta no es un array.');
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'No se encontraron datos para el reporte.' });
            return;
        }

        // Crear el documento PDF
        const doc = new pdfkit();
        const tempFilePath = path.join(os.tmpdir(), 'reporte_administrador.pdf');
        const writeStream = fs.createWriteStream(tempFilePath);

        doc.pipe(writeStream);
        doc.fontSize(25).text('Reporte de Consultas', { align: 'center' });
        doc.moveDown();

        results.forEach(cita => {
            const duracionEnMinutos = cita.duracion; // Asumiendo que la duración ya está en minutos
            const duracionFormateada = duracionEnMinutos >= 60 
                ? `${Math.floor(duracionEnMinutos / 60)} horas y ${duracionEnMinutos % 60} minutos`
                : `${duracionEnMinutos} minutos`;
            doc.fontSize(14).text(`CIta para el Curso: ${cita.cursoCodigo} - ${cita.cursoNombre}`);
            doc.fontSize(12).text(``);
            doc.fontSize(12).text(`
                Del Profesor: ${cita.profesorNombre} al Estudiante: ${cita.estudianteNombre} 
                con el nuemro de carnet ${cita.estudianteCarnet} de ${cita.estudianteEstrellas} estrellas, el dia ${cita.dia},   
                que se encuentra en un estado ${cita.estado} con una duracion de ${duracionFormateada} `);
            doc.fontSize(12).text(``);
            doc.moveDown();
        });

        doc.end();

        writeStream.on('finish', () => {
            res.download(tempFilePath, 'reporte_administrador.pdf', (err) => {
                if (err) {
                    console.error('Error al enviar el archivo:', err);
                    res.status(500).json({ error: 'Error al enviar el archivo' });
                } else {
                    // Eliminar el archivo temporal después de enviarlo
                    fs.unlink(tempFilePath, (unlinkErr) => {
                        if (unlinkErr) console.error('Error al eliminar el archivo temporal:', unlinkErr);
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
};
