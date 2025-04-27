const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('./clients.db');

// Créer la table clients si elle n'existe pas
//db.run(`
//    CREATE TABLE IF NOT EXISTS clients (
//        id INTEGER PRIMARY KEY AUTOINCREMENT,
//        nom TEXT NOT NULL,
//        prenom TEXT NOT NULL,
//        email TEXT NOT NULL UNIQUE,
//        telephone TEXT,
//        adresse TEXT,
//        dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP
//    )
//`);

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "web",
  host: "34.118.137.54",
  database: "postgres",
  password: "webpelouse",
  port: 5432,
});

// Récupérer tous les clients
router.get('/', (req, res) => {
//    pool.query('SELECT * FROM dev.clients', [], (err, rows) => {
    pool.query('SELECT * FROM dev.clients order by id desc',  (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(rows.rows);
        //console.log('rows', rows.rows);
    });
});

// Créer un nouveau client
router.post('/', (req, res) => {
    const { nom, prenom, email, telephone, adresse } = req.body;
    //console.log('req.body', req.body);
    pool.query(
        "INSERT INTO dev.clients (nom, prenom, email, telephone, adresse) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nom, prenom, email, telephone, adresse]
        ,
        function (err) {
            if (err) {
                console.log('err', err);
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return ('wow')
                    //return res.status(400).json({ message: 'Email déjà utilisé.' });
                }
                return res.status(400).json({ message: err.message });
            }
            pool.query('SELECT * FROM dev.clients WHERE id = (select max(id) FROM dev.clients)', (err, row) => {
                
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                //console.log('row', row);
                res.status(201).json(row.rows[0]);
            }
        );
        }
    );
});

// Mettre à jour un client par ID
router.put('/:id', (req, res) => {
    const clientId = parseInt(req.params.id);
    const { nom, prenom, email, telephone, adresse } = req.body;
    pool.query(
        `UPDATE dev.clients SET nom = $1, prenom = $2, email = $3, telephone = $4, adresse = $5 WHERE id =  ${clientId} RETURNING *`,
        [nom, prenom, email, telephone, adresse],

        function (err, result) {
            //console.log('result', result);
            //console.log('error', err);
            if (err) {
                console.log('err', err);
                return res.status(500).json({ message: err.message });
            }
            //console.log('result.rowCount', result.rowCount);
            if (result.rowCount > 0) {
                pool.query('SELECT * FROM dev.clients WHERE id = $1' , [clientId], (err, row) => {
                    if (err) {
                        console.log('error', err);
                        return res.status(500).json({ message: err.message });
                    }
                    res.json(row);
                });
            } else {
                res.status(404).json({ message: `Client avec l'ID ${clientId} non trouvé.` });
            }
        }
    );
});

// Supprimer un client par ID
router.delete('/:id', (req, res) => {
    const clientId = parseInt(req.params.id);
    console.log('clientId', clientId);
    pool.query('DELETE FROM dev.clients WHERE id = $1', [clientId], function (err,row) {
  
        //console.log('err', err);
        //console.log('row', row);
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (row.rowCount > 0) {
            res.json({ message: `Client avec l'ID ${clientId} supprimé avec succès.` });
        } else {
            res.status(404).json({ message: `Client avec l'ID ${clientId} non trouvé.` });
        }
    });
});

module.exports = router;