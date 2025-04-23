const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const clientsRouter = require('./routes/clients');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/clients', clientsRouter);

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});