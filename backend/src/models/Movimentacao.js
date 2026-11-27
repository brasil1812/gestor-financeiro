const mongoose = require('mongoose');

const CATEGORIAS_VALIDAS = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Outros',
];

const movimentacaoSchema = new mongoose.Schema(
  {
    descricao: {
      type: String,
      required: [true, 'A descrição é obrigatória.'],
      trim: true,
      maxlength: [120, 'A descrição deve ter no máximo 120 caracteres.'],
    },
    tipo: {
      type: String,
      required: [true, 'O tipo é obrigatório.'],
      enum: {
        values: ['receita', 'despesa'],
        message: 'O tipo deve ser "receita" ou "despesa".',
      },
    },
    categoria: {
      type: String,
      required: [true, 'A categoria é obrigatória.'],
      enum: {
        values: CATEGORIAS_VALIDAS,
        message: 'Categoria inválida.',
      },
    },
    valor: {
      type: Number,
      required: [true, 'O valor é obrigatório.'],
      min: [0.01, 'O valor deve ser maior que zero.'],
    },
    data: {
      type: Date,
      required: [true, 'A data é obrigatória.'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Movimentacao = mongoose.model('Movimentacao', movimentacaoSchema);

module.exports = { Movimentacao, CATEGORIAS_VALIDAS };
