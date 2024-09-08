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