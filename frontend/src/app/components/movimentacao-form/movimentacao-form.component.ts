import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATEGORIAS, Movimentacao, TipoMovimentacao } from '../../models/movimentacao.model';

@Component({
  selector: 'app-movimentacao-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel">
      <h2>{{ movimentacaoEdicao() ? 'Editar Movimentação' : 'Nova Movimentação' }}</h2>

      <form (ngSubmit)="onSubmit()" #formRef="ngForm" class="form-grid">
        <div class="field field-full">
          <label for="descricao">Descrição</label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            required
            maxlength="120"
            placeholder="Ex.: Salário mensal, Supermercado..."
            [(ngModel)]="descricao"
          />
        </div>

        <div class="field">
          <label for="tipo">Tipo</label>
          <select id="tipo" name="tipo" required [(ngModel)]="tipo">
            <option value="receita">Receita (Entrada)</option>
            <option value="despesa">Despesa (Saída)</option>
          </select>
        </div>

        <div class="field">
          <label for="categoria">Categoria</label>
          <select id="categoria" name="categoria" required [(ngModel)]="categoria">
            @for (cat of categorias; track cat.nome) {
              <option [value]="cat.nome">{{ cat.nome }}</option>
            }
          </select>
        </div>

        <div class="field">
          <label for="valor">Valor (R$)</label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0,00"
            [(ngModel)]="valor"
          />
        </div>

        <div class="field">
          <label for="data">Data</label>
          <input id="data" name="data" type="date" required [(ngModel)]="data" />
        </div>

        <div class="actions field-full">
          <button type="submit" class="btn-primary" [disabled]="formRef.invalid">
            {{ movimentacaoEdicao() ? 'Salvar Alterações' : 'Registrar Movimentação' }}
          </button>

          @if (movimentacaoEdicao()) {
            <button type="button" class="btn-secondary" (click)="onCancelar()">
              Cancelar
            </button>
          }
        </div>
      </form>
    </section>
  `,
  styles: `
    .panel {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
    }

    h2 {
      margin: 0 0 1rem 0;
      font-size: 1.15rem;
      color: #0f172a;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.9rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field-full {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }

    input,
    select {
      padding: 0.6rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.95rem;
      color: #0f172a;
      background: #f8fafc;
      transition: border-color 0.15s;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #2563eb;
      background: #ffffff;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.35rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.65rem 1.2rem;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #334155;
    }
    .btn-secondary:hover {
      background: #cbd5e1;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class MovimentacaoFormComponent {
  readonly movimentacaoEdicao = input<Movimentacao | null>(null);
  readonly salvar = output<Omit<Movimentacao, '_id'>>();
  readonly cancelarEdicao = output<void>();

  readonly categorias = CATEGORIAS;

  descricao = '';
  tipo: TipoMovimentacao = 'despesa';
  categoria = 'Alimentação';
  valor: number | null = null;
  data = this.obterDataHoje();

  constructor() {
    effect(() => {
      const edicao = this.movimentacaoEdicao();
      if (edicao) {
        this.descricao = edicao.descricao;
        this.tipo = edicao.tipo;
        this.categoria = edicao.categoria;
        this.valor = edicao.valor;
        this.data = edicao.data ? edicao.data.slice(0, 10) : this.obterDataHoje();
      } else {
        this.resetarFormulario();
      }
    });
  }

  onSubmit(): void {
    if (!this.descricao.trim() || !this.valor || this.valor <= 0 || !this.data) {
      return;
    }

    this.salvar.emit({
      descricao: this.descricao.trim(),
      tipo: this.tipo,
      categoria: this.categoria,
      valor: Number(this.valor),
      data: `${this.data}T12:00:00.000Z`,
    });

    if (!this.movimentacaoEdicao()) {
      this.resetarFormulario();
    }
  }

  onCancelar(): void {
    this.resetarFormulario();
    this.cancelarEdicao.emit();
  }

  private resetarFormulario(): void {
    this.descricao = '';
    this.tipo = 'despesa';
    this.categoria = 'Alimentação';
    this.valor = null;
    this.data = this.obterDataHoje();
  }

  private obterDataHoje(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
