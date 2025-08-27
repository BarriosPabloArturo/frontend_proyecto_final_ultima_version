import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-notas-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notas-list-page.html',
  styleUrl: './notas-list-page.scss',
})
export class NotasListPage {
  notas: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api
      .obtenerNotas()
      .then((res) => {
        this.notas = res.data;
      })
      .catch((err) => {
        console.error('Error al cargar notas:', err);
      });
  }
}
