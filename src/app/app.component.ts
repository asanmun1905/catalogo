import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogoService } from './services/games.service';
import { Videojuego } from './models/game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'proj-game';

  private catalogoService = inject(CatalogoService);
  videojuegos: Videojuego[] = [];
  videojuegoSeleccionado: Videojuego | null = null;
  generoSeleccionado = '';
  plataformaSeleccionada = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalVideojuegos = 0;
  totalPaginas = 0;

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  buscarVideojuegoPorId(id: string): void {
    this.catalogoService.obtenerVideojuegoPorId(Number(id)).subscribe(videojuego => {
      this.videojuegoSeleccionado = videojuego;
    });
  }

  cargarVideojuegos(): void {
    this.catalogoService.obtenerVideojuegos(this.paginaActual, this.elementosPorPagina, this.generoSeleccionado, this.plataformaSeleccionada).subscribe(respuesta => {
      this.videojuegos = respuesta.body ?? [];
      this.totalVideojuegos = Number(respuesta.headers.get('X-Total-Count') ?? 0);
      this.totalPaginas = Math.ceil(this.totalVideojuegos / this.elementosPorPagina);
    });
  }

  irAPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarVideojuegos();
    }
  }

  irAPaginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarVideojuegos();
    }
  }

  cambiarGenero(genero: string): void {
    this.generoSeleccionado = genero;
    this.paginaActual = 1;
    this.cargarVideojuegos();
  }

  cambiarPlataforma(plataforma: string): void {
    this.plataformaSeleccionada = plataforma;
    this.paginaActual = 1;
    this.cargarVideojuegos();
  }

  cambiarElementosPorPagina(limite: string): void {
    this.elementosPorPagina = Number(limite);
    this.paginaActual = 1;
    this.cargarVideojuegos();
  }

  buscarPorTitulo(titulo: string): void {
    this.catalogoService.buscarVideojuegosPorTitulo(titulo).subscribe(videojuegos => {
      this.videojuegos = videojuegos;
    });
  }

  filtrarPorPrecio(minimo: string, maximo: string): void {
    this.catalogoService.obtenerVideojuegosPorPrecio(minimo, maximo).subscribe(videojuegos => {
      this.videojuegos = videojuegos;
    });
  }
}
