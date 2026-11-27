import { Component, OnInit, inject, signal } from '@angular/core';
import { Movimentacao, ResumoFinanceiro } from './models/movimentacao.model';
import { MovimentacaoService } from './services/movimentacao.service';
import { ResumoFinanceiroComponent } from './components/resumo-financeiro/resumo-financeiro.component';
import { MovimentacaoFormComponent } from './components/movimentacao-form/movimentacao-form.component';
import { MovimentacaoListaComponent } from './components/movimentacao-lista/movimentacao-lista.component';
import { GraficoCategoriasComponent } from './components/grafico-categorias/grafico-categorias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ResumoFinanceiroComponent,
    MovimentacaoFormComponent,
    MovimentacaoListaComponent,
    GraficoCategoriasComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly movimentacaoService = inject(MovimentacaoService);

  readonly movimentacoes = signal<Movimentacao[]>([]);
  readonly todasMovimentacoes = signal<Movimentacao[]>([]);
  readonly resumo = signal<ResumoFinanceiro>({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
  });

  readonly filtroCategoria = signal<string>('');
  readonly filtroTipo = signal<string>('');
  readonly movimentacaoEdicao = signal<Movimentacao | null>(null);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.erro.set(null);

    this.movimentacaoService
      .listar(this.filtroCategoria(), this.filtroTipo())
      .subscribe({
        next: (dados) => this.movimentacoes.set(dados),
        error: () =>
          this.erro.set(
            'Não foi possível conectar à API. Verifique se o backend Node.js está rodando na porta 3000.'
          ),
      });

    this.movimentacaoService.listar().subscribe({
      next: (dados) => this.todasMovimentacoes.set(dados),
      error: () => {},
    });

    this.movimentacaoService.obterResumo().subscribe({
      next: (resumo) => this.resumo.set(resumo),
      error: () => {},
    });
  }

  aoAlterarFiltroCategoria(categoria: string): void {
    this.filtroCategoria.set(categoria);
    this.carregarDados();
  }

  aoAlterarFiltroTipo(tipo: string): void {
    this.filtroTipo.set(tipo);
    this.carregarDados();
  }

  aoSalvarMovimentacao(dados: Omit<Movimentacao, '_id'>): void {
    const edicao = this.movimentacaoEdicao();

    if (edicao?._id) {
      this.movimentacaoService.atualizar(edicao._id, dados).subscribe({
        next: () => {
          this.movimentacaoEdicao.set(null);
          this.carregarDados();
        },
        error: () => this.erro.set('Erro ao atualizar a movimentação.'),
      });
    } else {
      this.movimentacaoService.criar(dados).subscribe({
        next: () => this.carregarDados(),
        error: () => this.erro.set('Erro ao cadastrar a movimentação.'),
      });
    }
  }

  aoEditar(movimentacao: Movimentacao): void {
    this.movimentacaoEdicao.set(movimentacao);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aoCancelarEdicao(): void {
    this.movimentacaoEdicao.set(null);
  }

  aoExcluir(id: string): void {
    if (!confirm('Deseja realmente excluir esta movimentação?')) {
      return;
    }

    this.movimentacaoService.remover(id).subscribe({
      next: () => {
        if (this.movimentacaoEdicao()?._id === id) {
          this.movimentacaoEdicao.set(null);
        }
        this.carregarDados();
      },
      error: () => this.erro.set('Erro ao excluir a movimentação.'),
    });
  }
}
