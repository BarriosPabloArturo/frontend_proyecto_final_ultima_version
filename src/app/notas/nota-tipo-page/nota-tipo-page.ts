import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-nota-tipo-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nota-tipo-page.html',
  styleUrl: './nota-tipo-page.scss'
})
export class NotaTipoPage {

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  irACalendario() {
    const mesActual = new Date();
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();

    console.log('🔍 Buscando calendario para año:', año, 'mes:', mes);

    this.api.obtenerNotas().then(res => {
      console.log('📋 Total de notas:', res.data.length);

      // Mostrar todas las notas de calendario
      const calendarios = res.data.filter((nota: any) => nota.tipo === 'calendario');
      console.log('📅 Calendarios encontrados:', calendarios);

      res.data.forEach((nota: any, index: number) => {
        if (nota.tipo === 'calendario') {
          console.log(`📅 Calendario ${index}:`, JSON.stringify(nota, null, 2));
        }
      });

      const calendarioExistente = res.data.find((nota: any) =>
        nota.tipo === 'calendario' &&
        nota.anio === año &&
        nota.mes === mes
      );

      if (calendarioExistente) {
        console.log('✅ Navegando a calendario existente:', calendarioExistente._id);
        this.router.navigate(['/notas', calendarioExistente._id, 'calendario']);
      } else {
        console.log('🆕 Creando nuevo calendario');
        this.router.navigate(['/notas/nueva/calendario']);
      }
    }).catch(err => {
      console.error('❌ Error:', err);
      this.router.navigate(['/notas/nueva/calendario']);
    });
  }
}