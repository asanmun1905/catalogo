import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Videojuego } from '../models/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private readonly urlApi = 'http://localhost:3000/games';
  private readonly clienteHttp = inject(HttpClient);

  obtenerVideojuegos(pagina: number, limite: number, genero: string, plataforma: string): Observable<HttpResponse<Videojuego[]>> {
    let parametros = new HttpParams().set('_page', pagina).set('_limit', limite);

    if (genero) {
      parametros = parametros.set('genre', genero);
    }
    if (plataforma) {
      parametros = parametros.set('platform', plataforma);
    }

    return this.clienteHttp.get<Videojuego[]>(this.urlApi, { params: parametros, observe: 'response' });
  }

  obtenerVideojuegoPorId(id: number): Observable<Videojuego> {
    return this.clienteHttp.get<Videojuego>(`${this.urlApi}/${id}`);
  }

  buscarVideojuegosPorTitulo(titulo: string): Observable<Videojuego[]> {
    return this.clienteHttp.get<Videojuego[]>(`${this.urlApi}?title_like=${titulo}`);
  }

  obtenerVideojuegosPorPrecio(minimo: string, maximo: string): Observable<Videojuego[]> {
    let parametros = new HttpParams();

    if (minimo) {
      parametros = parametros.set('price_gte', minimo);
    }
    if (maximo) {
      parametros = parametros.set('price_lte', maximo);
    }

    return this.clienteHttp.get<Videojuego[]>(this.urlApi, { params: parametros });
  }
}
