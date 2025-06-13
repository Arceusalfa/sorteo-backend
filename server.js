
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./boletos.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/boletos', (req, res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const porPagina = parseInt(req.query.porPagina) || 500;
    const offset = (pagina - 1) * porPagina;

    db.all('SELECT * FROM boletos ORDER BY numero ASC LIMIT ? OFFSET ?', [porPagina, offset], (err, filas) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener boletos' });
        } else {
            res.json(filas);
        }
    });
});

app.post('/actualizar', (req, res) => {
    const { numero, estado, comprador_nombre, comprador_correo, comprador_telefono } = req.body;
    db.run('UPDATE boletos SET estado = ?, comprador_nombre = ?, comprador_correo = ?, comprador_telefono = ? WHERE numero = ?',
        [estado, comprador_nombre, comprador_correo, comprador_telefono, numero],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al actualizar boleto' });
            } else {
                res.json({ mensaje: 'Boleto actualizado correctamente' });
            }
        });
});

app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
