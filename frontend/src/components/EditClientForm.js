import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientForm.css'; // Réutilisez le style du formulaire d'ajout

const EditClientForm = ({ client, onClientUpdated, onCancelEdit }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');

    useEffect(() => {
        if (client) {
            setNom(client.nom);
            setPrenom(client.prenom);
            setEmail(client.email);
            setTelephone(client.telephone || '');
            setAdresse(client.adresse || '');
        }
    }, [client]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedClient = { nom, prenom, email, telephone, adresse };

        try {
            // Envoi de la requête PUT pour mettre à jour le client
            const response = await axios.put(`http://localhost:5000/api/clients/${client.id}`, updatedClient);
            onClientUpdated(response.data);
            alert('Client mis à jour avec succès.');
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client:', error);
            alert('Erreur lors de la mise à jour du client.');
            alert(error.response.data.message);

        }
        
    };

    const handleCancel = () => {
        onCancelEdit();
    };

    if (!client) {
        return null; // Ne rien afficher si aucun client n'est sélectionné pour l'édition
    }

    return (
        <div className="client-form-container">
            <h2>Modifier le Client</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nom">Nom:</label>
                    <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="prenom">Prénom:</label>
                    <input type="text" id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="telephone">Téléphone:</label>
                    <input type="text" id="telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="adresse">Adresse:</label>
                    <textarea id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                </div>
                <button type="submit">Enregistrer les Modifications</button>
                <button type="button" onClick={handleCancel} style={{ marginLeft: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}>
                    Annuler
                </button>
            </form>
        </div>
    );
};

export default EditClientForm;