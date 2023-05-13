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
app.use(express.urlencoded({ extended: true }));
  
// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'API de Tipo de Cambio',
        description: 'API que devuelve el tipo de cambio actual y verifica el inicio de sesión correcto',
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
      components: {
        headers: {
          ContentType: {
            description: 'Tipo de contenido',
            schema: {
              type: 'string',
              default: 'application/json'
            }
          },
          ContentLength: {
            description: 'Longitud del contenido',
            schema: {
              type: 'integer'
            }
          }
        }
      }
    },
    apis: ['./routes/tipoCambio.js']
  };
  
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
