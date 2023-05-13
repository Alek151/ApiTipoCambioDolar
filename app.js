const express = require('express');
const tipoCambioRouter = require('./routes/tipoCambio');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// agregar el middleware de cors
app.use(cors());

// agregar el middleware de helmet
app.use(helmet());

app.use(express.json());
app.use('/tipoCambio', tipoCambioRouter);


  
// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'API de Tipo de Cambio',
        description: 'API que devuelve el tipo de cambio actual',
        contact: {
          name: 'Alexander Garcia'
        },
        servers: ['http://localhost:3000']
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header'
        }
      },
      security: [
        {
          apiKey: []
        }
      ]
    },
    apis: ['./routes/tipoCambio.js']
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
