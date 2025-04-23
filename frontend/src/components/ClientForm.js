import React, { useState } from 'react';
import axios from 'axios';
import './ClientForm.css'; // Import du fichier CSS

const ClientForm = ({ onClientAdded }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nouveauClient = { nom, prenom, email, telephone, adresse };

        try {
            const response = await axios.post('http://localhost:5000/api/clients', nouveauClient);
            onClientAdded(response.data);
            setNom('');
            setPrenom('');
            setEmail('');
            setTelephone('');
            setAdresse('');
        } catch (error) {
            console.error('Erreur lors de la création du client:', error);
            alert('Erreur lors de la création du client.');
            alert(error.response.data.message);
        }
    };

    return (
        <div className="client-form-container">
            <h2>Ajouter un Nouveau Client</h2>
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
                <button type="submit">Ajouter Client</button>
            </form>
        </div>
    );
};

export default ClientForm;