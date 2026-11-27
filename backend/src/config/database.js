const dns = require('node:dns');
const mongoose = require('mongoose');

async function conectarBanco() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('A variável de ambiente MONGO_URI não foi definida no arquivo .env.');
  }

  // Evita erro "querySrv ECONNREFUSED" em redes Windows com DNS que bloqueiam consultas SRV
  if (mongoUri.startsWith('mongodb+srv://')) {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  }

  await mongoose.connect(mongoUri);
  console.log('Conectado ao MongoDB com sucesso!');
}

module.exports = { conectarBanco };
