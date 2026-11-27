const express = require('express');
const {
  listarMovimentacoes,
  obterResumo,
  buscarMovimentacaoPorId,
  criarMovimentacao,
  atualizarMovimentacao,
  removerMovimentacao,
} = require('../controllers/movimentacaoController');

const router = express.Router();

router.get('/resumo', obterResumo);
router.get('/', listarMovimentacoes);
router.get('/:id', buscarMovimentacaoPorId);
router.post('/', criarMovimentacao);
router.put('/:id', atualizarMovimentacao);
router.delete('/:id', removerMovimentacao);

module.exports = router;
