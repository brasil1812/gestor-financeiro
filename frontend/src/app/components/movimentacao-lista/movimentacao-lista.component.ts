import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CATEGORIAS, Movimentacao, obterConfigCategoria } from '../../models/movimentacao.model';

@Component({
  selector: 'app-movimentacao-lista',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  template: `
    <section class="panel">
      <div class="header-lista">
        <h2>Movimentações</h2>

        <div class="filtros">
          <select
            aria-label="Filtrar por tipo"
            [ngModel]="filtroTipo()"
            (ngModelChange)="alterarFiltroTipo.emit($event)"
          >
            <option value="">Todos os tipos</option>
            <option value="receita">Apenas Receitas</option>
            <option value="despesa">Apenas Despesas</option>
          </select>

          <select
            aria-label="Filtrar por categoria"
            [ngModel]="filtroCategoria()"
            (ngModelChange)="alterarFiltroCategoria.emit($event)"
          >
            <option value="">Todas as categorias</option>
            @for (cat of categorias; track cat.nome) {
              <option [value]="cat.nome">{{ cat.nome }}</option>
            }
          </select>
        </div>
      </div>

      @if (movimentacoes().length === 0) {
        <p class="vazio">Nenhuma movimentação encontrada para os filtros selecionados.</p>
      } @else {
        <div class="lista">
          @for (item of movimentacoes(); track item._id) {
            @let catConfig = obterCategoria(item.categoria);
            <article class="item" [style.border-left-color]="catConfig.cor">
              <div class="item-info">
                <div class="item-topo">
                  <strong class="descricao">{{ item.descricao }}</strong>
                  <span
                    class="badge"
                    [style.color]="catConfig.cor"
                    [style.background-color]="catConfig.corFundo"
                  >
                    {{ item.categoria }}
                  </span>
                </div>
                <span class="meta">
                  {{ item.data | date : 'dd/MM/yyyy' }} •
                  {{ item.tipo === 'receita' ? 'Entrada' : 'Saída' }}
                </span>
              </div>

              <div class="item-acoes">
                <span
                  class="valor"
                  [class.valor-receita]="item.tipo === 'receita'"
                  [class.valor-despesa]="item.tipo === 'despesa'"
                >
                  {{ item.tipo === 'receita' ? '+' : '-' }}
                  {{ item.valor | currency : 'BRL' }}
                </span>

                <div class="botoes">
                  <button type="button" class="btn-editar" (click)="editar.emit(item)">
                    Editar
                  </button>
                  <button type="button" class="btn-excluir" (click)="excluir.emit(item._id!)">
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .panel {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
      margin-top: 1.5rem;
    }

    .header-lista {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0;
      font-size: 1.15rem;
      color: #0f172a;
    }

    .filtros {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    select {
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.9rem;
      background: #f8fafc;
      color: #0f172a;
    }

    .vazio {
      text-align: center;
      color: #64748b;
      padding: 2rem 0;
      margin: 0;
    }

    .lista {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      padding: 0.95rem 1.1rem;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #475569;
      border-radius: 10px;
      background: #ffffff;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .item-topo {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.55rem;
    }

    .descricao {
      font-size: 1rem;
      color: #0f172a;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
    }

    .meta {
      font-size: 0.82rem;
      color: #64748b;
    }

    .item-acoes {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .valor {
      font-size: 1.05rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .valor-receita {
      color: #15803d;
    }

    .valor-despesa {
      color: #b91c1c;
    }

    .botoes {
      display: flex;
      gap: 0.45rem;
    }

    .btn-editar,
    .btn-excluir {
      padding: 0.4rem 0.7rem;
      border: none;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-editar {
      background: #e0f2fe;
      color: #0369a1;
    }
    .btn-editar:hover {
      background: #bae6fd;
    }

    .btn-excluir {
      background: #fee2e2;
      color: #b91c1c;
    }
    .btn-excluir:hover {
      background: #fecaca;
    }
  `,
})
export class MovimentacaoListaComponent {
  readonly movimentacoes = input.required<Movimentacao[]>();
  readonly filtroCategoria = input<string>('');
  readonly filtroTipo = input<string>('');

  readonly alterarFiltroCategoria = output<string>();
  readonly alterarFiltroTipo = output<string>();
  readonly editar = output<Movimentacao>();
  readonly excluir = output<string>();

  readonly categorias = CATEGORIAS;

  obterCategoria(nome: string) {
    return obterConfigCategoria(nome);
  }
}
