const { crashReporter } = require('electron');
const request = require('request');
const manifest = require('../package.json');
const axios = require('axios');

const host = 'http://localhost:3000';

const config = {
    productName: 'Fire Sale',
    companyName: 'Frontend Masters',
    submitURL: host + '/crashreports',
    uploadToServer: true,
};

crashReporter.start(config);
console.log('crashReporter started');
console.log({config});

const sendUncaughtException = error => {
  const { productName, companyName } = config;
  // console.log('ERROR:', {error});
  axios.post(host + '/uncaughtexceptions', {
    _productName: productName,
    _companyName: companyName,
    _version: manifest.version,
    platform: process.platform,
    process_type: process.type,
    error: { 
      name: error.name,
      message: error.message,
      fileName: error.fileName,
      stack: error.stack,
      lineNumber: error.lineNumber,
      columnNumber: error.columnNumber,
    }
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    // console.log(res);
  })
  .catch(error => {
    console.error(error);
  });


  // request.post(host + '/uncaughtexceptions', {
  //   _productName: productName,
  //   _companyName: companyName,
  //   _version: manifest.version,
  //   platform: process.platform,
  //   process_type: process.type,
  //   error: { 
  //     name: error.name,
  //     message: error.message,
  //     fileName: error.fileName,
  //     stack: error.stack,
  //     lineNumber: error.lineNumber,
  //     columnNumber: error.columnNumber,
  //   }
  // });
};
// browser is the main process
if (process.type === 'browser') {
  console.log('ligando erros no main...');
  process.on('uncaughtException', sendUncaughtException);
}
else {
  console.log('ligando erros no renderer...');
  window.addEventListener('error', sendUncaughtException);
}

module.exports = crashReporter;