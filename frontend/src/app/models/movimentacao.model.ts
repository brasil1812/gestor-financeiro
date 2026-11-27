export type TipoMovimentacao = 'receita' | 'despesa';

export interface Movimentacao {
  _id?: string;
  descricao: string;
  tipo: TipoMovimentacao;
  categoria: string;
  valor: number;
  data: string;
}

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface CategoriaConfig {
  nome: string;
  cor: string;
  corFundo: string;
}

export const CATEGORIAS: CategoriaConfig[] = [
  { nome: 'Salário', cor: '#15803d', corFundo: '#dcfce7' },
  { nome: 'Freelance', cor: '#0f766e', corFundo: '#ccfbf1' },
  { nome: 'Investimentos', cor: '#1d4ed8', corFundo: '#dbeafe' },
  { nome: 'Alimentação', cor: '#c2410c', corFundo: '#ffedd5' },
  { nome: 'Moradia', cor: '#7e22ce', corFundo: '#f3e8ff' },
  { nome: 'Transporte', cor: '#a16207', corFundo: '#fef9c3' },
  { nome: 'Saúde', cor: '#be123c', corFundo: '#ffe4e6' },
  { nome: 'Educação', cor: '#4338ca', corFundo: '#e0e7ff' },
  { nome: 'Lazer', cor: '#be185d', corFundo: '#fce7f3' },
  { nome: 'Outros', cor: '#475569', corFundo: '#f1f5f9' },
];

export function obterConfigCategoria(nomeCategoria: string): CategoriaConfig {
  return (
    CATEGORIAS.find((c) => c.nome === nomeCategoria) ?? {
      nome: nomeCategoria,
      cor: '#475569',
      corFundo: '#f1f5f9',
    }
  );
}
