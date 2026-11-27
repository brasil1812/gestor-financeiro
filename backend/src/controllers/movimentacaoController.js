const mongoose = require('mongoose');
const { Movimentacao } = require('../models/Movimentacao');

// GET /api/movimentacoes?categoria=...&tipo=...
async function listarMovimentacoes(req, res) {
  try {
    const filtro = {};

    if (req.query.categoria) {
      filtro.categoria = req.query.categoria;
    }

    if (req.query.tipo) {
      filtro.tipo = req.query.tipo;
    }

    const movimentacoes = await Movimentacao.find(filtro).sort({ data: -1, createdAt: -1 });
    return res.status(200).json(movimentacoes);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar movimentações.', detalhes: error.message });
  }
}

// GET /api/movimentacoes/resumo
async function obterResumo(req, res) {
  try {
    const movimentacoes = await Movimentacao.find();

    let totalReceitas = 0;
    let totalDespesas = 0;

    for (const item of movimentacoes) {
      if (item.tipo === 'receita') {
        totalReceitas += item.valor;
      } else {
        totalDespesas += item.valor;
      }
    }

    return res.status(200).json({
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao calcular resumo financeiro.', detalhes: error.message });
  }
}

// GET /api/movimentacoes/:id
async function buscarMovimentacaoPorId(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const movimentacao = await Movimentacao.findById(id);

    if (!movimentacao) {
      return res.status(404).json({ erro: 'Movimentação não encontrada.' });
    }

    return res.status(200).json(movimentacao);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar movimentação.', detalhes: error.message });
  }
}

// POST /api/movimentacoes
async function criarMovimentacao(req, res) {
  try {
    const { descricao, tipo, categoria, valor, data } = req.body;

    const novaMovimentacao = await Movimentacao.create({
      descricao,
      tipo,
      categoria,
      valor,
      data,
    });

    return res.status(201).json(novaMovimentacao);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhes: error.message });
    }
    return res.status(500).json({ erro: 'Erro ao criar movimentação.', detalhes: error.message });
  }
}

// PUT /api/movimentacoes/:id
async function atualizarMovimentacao(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const { descricao, tipo, categoria, valor, data } = req.body;

    const atualizada = await Movimentacao.findByIdAndUpdate(
      id,
      { descricao, tipo, categoria, valor, data },
      { new: true, runValidators: true }
    );

    if (!atualizada) {
      return res.status(404).json({ erro: 'Movimentação não encontrada.' });
    }

    return res.status(200).json(atualizada);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhes: error.message });
    }
    return res.status(500).json({ erro: 'Erro ao atualizar movimentação.', detalhes: error.message });
  }
}

// DELETE /api/movimentacoes/:id
async function removerMovimentacao(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const removida = await Movimentacao.findByIdAndDelete(id);

    if (!removida) {
      return res.status(404).json({ erro: 'Movimentação não encontrada.' });
    }

    return res.status(200).json({ mensagem: 'Movimentação removida com sucesso.', id });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao remover movimentação.', detalhes: error.message });
  }
}

module.exports = {
  listarMovimentacoes,
  obterResumo,
  buscarMovimentacaoPorId,
  criarMovimentacao,
  atualizarMovimentacao,
  removerMovimentacao,
};
