import React from 'react';
import axios from 'axios';

const ClientList = ({ clients, onClientDeleted, onEditClient }) => {
    const handleDeleteClient = async (clientId) => {
        try {
            await axios.delete(`http://localhost:5000/api/clients/${clientId}`);
            onClientDeleted(clientId);
            alert('Client supprimé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression du client:', error);
            alert('Erreur lors de la suppression du client.');
        }
    };

    const handleEditClient = (client) => {
        onEditClient(client); // Informe le composant parent du client à éditer
    };

    return (
        <div>
            <h2>Liste des Clients</h2>
            {clients.length === 0 ? (
                <p>Aucun client enregistré.</p>
            ) : (
                <ul>
                    {clients.map(client => (
                        <li style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center', margin:'25px'}} key={client.id}>
                            <div>id:{client.id}: {client.prenom} {client.nom} ({client.email})
                            </div>
                            <div>
                            <button onClick={() => handleEditClient(client)} 
                               style={{  marginLeft: '100px', backgroundColor: '#007bff', 
                                         color: 'white', border: 'none', borderRadius: '4px', padding: '8px 8px', cursor: 'pointer' }}>
                                Modifier
                            </button>
                            <button onClick={() => handleDeleteClient(client.id)} 
                               style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: 'white', 
                                        border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}>
                                Supprimer
                            </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClientList;