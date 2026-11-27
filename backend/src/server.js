require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { conectarBanco } = require('./config/database');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de saúde para verificar se a API está no ar
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'API Gestor Financeiro em execução.' });
});

app.use('/api/movimentacoes', movimentacaoRoutes);

async function iniciarServidor() {
  try {
    await conectarBanco();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

iniciarServidor();
