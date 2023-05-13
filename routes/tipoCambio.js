const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

// Ruta GET para obtener el tipo de cambio actual
/**
 * @swagger
 * /tipoCambio/dolar:
 *   get:
 *     summary: Obtiene el tipo de cambio actual
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Retorna el tipo de cambio actual
 */

router.get('/dolar', async (req, res, next) => {
  try {
    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
                      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                        <soap:Body>
                          <TipoCambioDiaString xmlns="http://www.banguat.gob.gt/variables/ws/" />
                        </soap:Body>
                      </soap:Envelope>`;
    const { data } = await axios.post('http://www.banguat.gob.gt/variables/ws/TipoCambio.asmx', xmlRequest, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'http://www.banguat.gob.gt/variables/ws/TipoCambioDiaString'
      },
      timeout: 5000 // timeout en milisegundos
    });
    const result = await xml2js.parseStringPromise(data);
    const tipoCambio = result['soap:Envelope']['soap:Body'][0].TipoCambioDiaStringResponse[0].TipoCambioDiaStringResult[0];
    res.set('Content-Type', 'application/json');
    const responseDetected = tipoCambio;
    xml2js.parseString(responseDetected, (err, result) => {
        if (err) {
          console.error(err);
          // Manejo de error si ocurre un problema al convertir el XML
        } else {
          // Accedemos a los valores de fecha y referencia
          const fecha = result.InfoVariable.CambioDolar[0].VarDolar[0].fecha[0];
          const referencia = result.InfoVariable.CambioDolar[0].VarDolar[0].referencia[0];
          // Devolvemos los valores como un objeto JSON
          const jsonResponse = { fecha, referencia };
          res.send(jsonResponse);
        }
      });

  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /tipoCambio/datos:
 *   post:
 *     description: Valida los datos de inicio de sesión del usuario
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Nombre de usuario
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Contraseña del usuario
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Datos de inicio de sesión correctos
 *       403:
 *         description: Datos inválidos, acceso denegado.
 *       401:
 *         description: Error al procesar la solicitud
 *     security:
 *       - authorization: []
 */




router.post("/datos", async (req, res, next) => {
  try {
    const userlogin = "admin"
    const passwordlogin = "123"
    const authorizationKeyVerified = "ABC123"
    const username = req.body.username;
    const password = req.body.password;
    const authorizationKey = req.headers.authorization;
    if(username == userlogin && password == passwordlogin && authorizationKey == authorizationKeyVerified  ) {
      const response = { usuario: username, clave: password, response: "Login correcto" };   
      res.status(200).json(response);
    } else {
      res.status(403).send('Datos invalidos, acceso denegado. ');
    }
  } catch (error) {
    console.error(error);
    res.status(401).send('Ocurrió un error durante el procesamiento de la solicitud.');
  }
});

module.exports = router;


