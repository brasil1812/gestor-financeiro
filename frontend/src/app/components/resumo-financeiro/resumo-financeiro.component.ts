import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ResumoFinanceiro } from '../../models/movimentacao.model';

@Component({
  selector: 'app-resumo-financeiro',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="resumo-grid">
      <div class="card card-receita">
        <span class="label">Total de Receitas</span>
        <strong class="valor">{{ resumo().totalReceitas | currency : 'BRL' }}</strong>
      </div>

      <div class="card card-despesa">
        <span class="label">Total de Despesas</span>
        <strong class="valor">{{ resumo().totalDespesas | currency : 'BRL' }}</strong>
      </div>

      <div class="card" [class.card-saldo-positivo]="resumo().saldo >= 0" [class.card-saldo-negativo]="resumo().saldo < 0">
        <span class="label">Saldo Atual</span>
        <strong class="valor">{{ resumo().saldo | currency : 'BRL' }}</strong>
      </div>
    </section>
  `,
  styles: `
    .resumo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
      border-top: 4px solid #cbd5e1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .valor {
      font-size: 1.65rem;
      font-weight: 700;
      color: #0f172a;
    }

    .card-receita {
      border-top-color: #16a34a;
    }
    .card-receita .valor {
      color: #15803d;
    }

    .card-despesa {
      border-top-color: #dc2626;
    }
    .card-despesa .valor {
      color: #b91c1c;
    }

    .card-saldo-positivo {
      border-top-color: #2563eb;
    }
    .card-saldo-positivo .valor {
      color: #1d4ed8;
    }

    .card-saldo-negativo {
      border-top-color: #ea580c;
    }
    .card-saldo-negativo .valor {
      color: #c2410c;
    }
  `,
})
export class ResumoFinanceiroComponent {
  readonly resumo = input.required<ResumoFinanceiro>();
}
