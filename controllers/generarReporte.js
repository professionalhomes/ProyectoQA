<<<<<<< HEAD
const { sequelize } = require('../config/db');
const pdfkit = require('pdfkit');
const path = require('path');
const fs = require('fs');
const os = require('os'); // Para manejar archivos temporales

exports.generarReporte = async (req, res) => {
    try {
        const { estudiante, reserved } = req.body;

        // Crear condiciones dinámicas para la consulta SQL
        let whereConditions = [];
        let replacements = {};

        if (estudiante && estudiante !== 'todos') {
            whereConditions.push('C.estudianteId = :estudiante');
            replacements.estudiante = estudiante;
        }

        if (reserved && reserved !== 'todos') {
            whereConditions.push('C.estado = :reserved');
            replacements.reserved = reserved;
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
                Estudiantes E ON C.estudianteId = E.id
            JOIN 
                disponibilidades D ON C.disponibilidadId = D.id
            JOIN 
                Cursos Cu ON D.cursoId = Cu.id
            JOIN 
                profesores P ON D.profesorId = P.id
            ${whereClause}
            ORDER BY 
                C.fecha ASC
        `;

        // Ejecutar la consulta SQL
        const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: replacements
        });

        // Verificar el tipo y contenido de results
        console.log('Resultados de la consulta:', results);
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
            doc.fontSize(14).text(`Curso: ${cita.cursoCodigo} - ${cita.cursoNombre}`);
            doc.fontSize(12).text(`Profesor: ${cita.profesorNombre}`);
            doc.text(`Estudiante: ${cita.estudianteNombre}`);
            doc.text(`Carnet: ${cita.estudianteCarnet}`);
            doc.text(`Estrellas: ${cita.estudianteEstrellas}`);
            doc.text(`Día: ${cita.dia}`);
            doc.text(`Hora Inicio: ${cita.horaInicio}`);
            doc.text(`Hora Fin: ${cita.horaFin}`);
            doc.text(`Duración: ${cita.duracion} minutos`);
            doc.text(`Estado de la Cita: ${cita.estado}`);
            doc.text(`Prioridad: ${cita.prioridad}`);
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

        writeStream.on('error', (writeErr) => {
            console.error('Error al escribir el archivo:', writeErr);
            res.status(500).json({ error: 'Error al escribir el archivo PDF' });
        });

    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
};
=======
const PDFDocument = require('pdfkit');
const Reporte = require('../models/Reporte');

exports.generarReporte = function(req, res) {
    const reporte = new Reporte('./config/db'); // Asegúrate de que la ruta a tu archivo de base de datos es correcta

    reporte.obtenerDatosReporte((err, datos) => {
        if (err) {
            res.status(500).send('Error al obtener datos para el reporte');
            return;
        }

        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(pdfData),
                'Content-Type': 'application/pdf',
                'Content-disposition': 'attachment;filename=reporte_administrador.pdf',
            }).end(pdfData);
        });

        doc.fontSize(16).text('Reporte del Administrador', 100, 50);
        doc.fontSize(12).text('Datos del Reporte:', 100, 100);
        
        datos.forEach((dato, index) => {
            doc.text(`${index + 1}. Dato: ${dato.alguna_columna}`, 100, 130 + index * 20);
        });

        doc.end();
    });
};
>>>>>>> 46e71e5ccfa3a90d0ee11e0af58ba6ee36cf6c58
