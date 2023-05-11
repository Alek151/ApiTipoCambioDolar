const express = require('express');
const tipoCambioRouter = require('./routes/tipoCambio');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// agregar el middleware de cors
app.use(cors());

// agregar el middleware de helmet
app.use(helmet());

app.use(express.json());
app.use('/tipoCambio', tipoCambioRouter);

module.exports = app;
