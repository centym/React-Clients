const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clients.db');

// Créer la table clients si elle n'existe pas
db.run(`
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        telephone TEXT,
        adresse TEXT,
        dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Récupérer tous les clients
router.get('/', (req, res) => {
    db.all('SELECT * FROM clients', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(rows);
    });
});

// Créer un nouveau client
router.post('/', (req, res) => {
    const { nom, prenom, email, telephone, adresse } = req.body;
    db.run(
        'INSERT INTO clients (nom, prenom, email, telephone, adresse) VALUES (?, ?, ?, ?, ?)',
        [nom, prenom, email, telephone, adresse],
        function (err) {
            if (err) {
               
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return ('wow')
                    //return res.status(400).json({ message: 'Email déjà utilisé.' });
                }
                return res.status(400).json({ message: err.message });
            }
            db.get('SELECT * FROM clients WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                res.status(201).json(row);
            });
        }
    );
});

// Mettre à jour un client par ID
router.put('/:id', (req, res) => {
    const clientId = req.params.id;
    const { nom, prenom, email, telephone, adresse } = req.body;
    db.run(
        'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ? WHERE id = ?',
        [nom, prenom, email, telephone, adresse, clientId],
        function (err) {
            if (err) {
                
                return res.status(500).json({ message: err.message });
            }
            if (this.changes > 0) {
                db.get('SELECT * FROM clients WHERE id = ?', [clientId], (err, row) => {
                    if (err) {
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
    const clientId = req.params.id;
    db.run('DELETE FROM clients WHERE id = ?', clientId, function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (this.changes > 0) {
            res.json({ message: `Client avec l'ID ${clientId} supprimé avec succès.` });
        } else {
            res.status(404).json({ message: `Client avec l'ID ${clientId} non trouvé.` });
        }
    });
});

module.exports = router;