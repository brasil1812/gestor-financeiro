import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { Movimentacao, obterConfigCategoria } from '../../models/movimentacao.model';

@Component({
  selector: 'app-grafico-categorias',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel">
      <div class="header-grafico">
        <h2>Gráfico por Categoria</h2>
        <select
          aria-label="Tipo exibido no gráfico"
          [ngModel]="tipoGrafico()"
          (ngModelChange)="tipoGrafico.set($event)"
        >
          <option value="despesa">Despesas</option>
          <option value="receita">Receitas</option>
          <option value="todos">Todas</option>
        </select>
      </div>

      <div class="canvas-wrapper">
        @if (!possuiDados()) {
          <p class="vazio">Cadastre movimentações para visualizar o gráfico de pizza.</p>
        }
        <canvas #chartCanvas [class.oculto]="!possuiDados()"></canvas>
      </div>
    </section>
  `,
  styles: `
    .panel {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header-grafico {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0;
      font-size: 1.15rem;
      color: #0f172a;
    }

    select {
      padding: 0.45rem 0.65rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.85rem;
      background: #f8fafc;
      color: #0f172a;
    }

    .canvas-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 250px;
      position: relative;
    }

    canvas {
      max-height: 280px;
    }

    .oculto {
      display: none;
    }

    .vazio {
      color: #64748b;
      text-align: center;
      font-size: 0.9rem;
    }
  `,
})
export class GraficoCategoriasComponent implements OnDestroy {
  readonly movimentacoes = input.required<Movimentacao[]>();
  readonly tipoGrafico = signal<'despesa' | 'receita' | 'todos'>('despesa');
  readonly possuiDados = signal(false);

  private readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chartInstance: Chart | null = null;

  constructor() {
    effect(() => {
      const lista = this.movimentacoes();
      const tipo = this.tipoGrafico();
      const canvasRef = this.chartCanvas();

      if (!canvasRef) {
        return;
      }

      const filtradas =
        tipo === 'todos' ? lista : lista.filter((item) => item.tipo === tipo);

      const totaisPorCategoria = new Map<string, number>();
      for (const item of filtradas) {
        const atual = totaisPorCategoria.get(item.categoria) ?? 0;
        totaisPorCategoria.set(item.categoria, atual + item.valor);
      }

      const labels = Array.from(totaisPorCategoria.keys());
      const valores = Array.from(totaisPorCategoria.values());
      const cores = labels.map((cat) => obterConfigCategoria(cat).cor);

      this.possuiDados.set(labels.length > 0);
      this.atualizarGrafico(canvasRef.nativeElement, labels, valores, cores);
    });
  }

  private atualizarGrafico(
    canvas: HTMLCanvasElement,
    labels: string[],
    valores: number[],
    cores: string[]
  ): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    if (labels.length === 0) {
      return;
    }

    this.chartInstance = new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: valores,
            backgroundColor: cores,
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }
}
