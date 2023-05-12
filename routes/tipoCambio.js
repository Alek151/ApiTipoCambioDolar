const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

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
      res.status(403).send('Login incorrecto, revisa tus datos. ');
    }
  } catch (error) {
    console.error(error);
    res.status(404).send('Ocurrió un error durante el procesamiento de la solicitud.');
  }
});

module.exports = router;
