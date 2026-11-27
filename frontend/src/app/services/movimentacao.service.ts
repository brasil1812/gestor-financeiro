import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimentacao, ResumoFinanceiro } from '../models/movimentacao.model';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/movimentacoes';

  listar(categoria?: string, tipo?: string): Observable<Movimentacao[]> {
    let params = new HttpParams();

    if (categoria) {
      params = params.set('categoria', categoria);
    }
    if (tipo) {
      params = params.set('tipo', tipo);
    }

    return this.http.get<Movimentacao[]>(this.apiUrl, { params });
  }

  obterResumo(): Observable<ResumoFinanceiro> {
    return this.http.get<ResumoFinanceiro>(`${this.apiUrl}/resumo`);
  }

  criar(movimentacao: Omit<Movimentacao, '_id'>): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(this.apiUrl, movimentacao);
  }

  atualizar(id: string, movimentacao: Omit<Movimentacao, '_id'>): Observable<Movimentacao> {
    return this.http.put<Movimentacao>(`${this.apiUrl}/${id}`, movimentacao);
  }

  remover(id: string): Observable<{ mensagem: string; id: string }> {
    return this.http.delete<{ mensagem: string; id: string }>(`${this.apiUrl}/${id}`);
  }
}
