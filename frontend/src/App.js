import React, { useState, useEffect } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import EditClientForm from './components/EditClientForm'; // Import du nouveau composant
import axios from 'axios';

function App() {
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
        }
    };

    const handleClientAdded = (nouveauClient) => {
        setClients([...clients, nouveauClient]);
    };

    const handleClientDeleted = (deletedClientId) => {
        setClients(clients.filter(client => client._id !== deletedClientId));
        fetchClients();
    };

    const handleEditClient = (client) => {
        setEditingClient(client); // Définit le client à éditer dans l'état
    };

    const handleClientUpdated = (updatedClient) => {
        setClients(clients.map(client => (client._id === updatedClient._id ? updatedClient : client)));
        setEditingClient(null); // Réinitialise l'état d'édition
        fetchClients();
    };

    const handleCancelEdit = () => {
        setEditingClient(null); // Réinitialise l'état d'édition
        fetchClients();
    };

    return (
        <div class="container">
            <div class="partie-1"> 
              <ClientList
                clients={clients}
                onClientDeleted={handleClientDeleted}
                onEditClient={handleEditClient}
              />
            </div>
            <div class="partie-2">
            <h2>Gestion des Clients</h2>
            {!editingClient && <ClientForm onClientAdded={handleClientAdded} />}
            {editingClient && (
                <EditClientForm
                    client={editingClient}
                    onClientUpdated={handleClientUpdated}
                    onCancelEdit={handleCancelEdit}
                />
            )}
            </div>
        </div>
    );
}

export default App;