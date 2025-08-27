import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nota-checklist-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nota-checklist-form-page.html',
  styleUrl: './nota-checklist-form-page.scss'
})
export class NotaChecklistFormPage implements OnInit {
  titulo: string = '';
  items: { texto: string, completado: boolean }[] = [{ texto: '', completado: false }];
  error: string = '';
  exito: string = '';
  id: string | null = null;
  editando: boolean = false;

  // Modal de confirmación para eliminar - AGREGAR ESTO
  mostrarModalEliminar: boolean = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.editando = true;
      this.api.obtenerNota(this.id).then(res => {
        const nota = res.data;
        this.titulo = nota.titulo;
        // Aquí va el código del paso 4:
        this.items = (nota.items && nota.items.length > 0
          ? nota.items.map((item: any) => ({ ...item, completado: !!item.completado }))
          : [{ texto: '', completado: false }]
        );
      }).catch(() => {
        this.error = 'Error al cargar la checklist';
      });
    }
  }

  agregarItem() {
    this.items.push({ texto: '', completado: false });
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
    if (this.items.length === 0) {
      this.items.push({ texto: '', completado: false });
    }
  }

  moverArriba(index: number) {
    if (index > 0) {
      [this.items[index - 1], this.items[index]] = [this.items[index], this.items[index - 1]];
      this.items = [...this.items]; // Fuerza la detección de cambios
    }
  }

  moverAbajo(index: number) {
    if (index < this.items.length - 1) {
      [this.items[index + 1], this.items[index]] = [this.items[index], this.items[index + 1]];
      this.items = [...this.items]; // Fuerza la detección de cambios
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  checarItem(index: number) {
    this.items[index].completado = !this.items[index].completado;
  }

  guardarChecklist() {
    this.error = '';
    this.exito = '';
    if (!this.titulo.trim()) {
      this.error = 'El título es obligatorio';
      return;
    }
    if (this.items.some(item => !item.texto.trim())) {
      this.error = 'Todos los ítems deben tener texto';
      return;
    }

    if (this.editando && this.id) {
      // Actualizar checklist existente
      this.api.actualizarNota(this.id, {
        titulo: this.titulo,
        tipo: 'checklist',
        items: this.items
      }).then(() => {
        this.router.navigate(['/notas']);
      }).catch(() => {
        this.error = 'Error al actualizar la checklist';
      });
    } else {
      // Crear nueva checklist
      this.api.crearNota({
        titulo: this.titulo,
        tipo: 'checklist',
        items: this.items
      }).then(() => {
        this.exito = 'Checklist guardada correctamente';
        this.titulo = '';
        this.items = [{ texto: '', completado: false }];
        setTimeout(() => this.router.navigate(['/notas']), 1000);
      }).catch(() => {
        this.error = 'Error al guardar la checklist';
      });
    }
  }

  eliminarChecklist() {
    if (this.editando && this.id) {
      // Mostrar modal de confirmación en lugar de confirm()
      this.mostrarModalEliminar = true;
    }
  }

  // Nuevo método para confirmar eliminación
  confirmarEliminar() {
    if (this.editando && this.id) {
      this.api.eliminarNota(this.id).then(() => {
        this.router.navigate(['/notas']);
      }).catch(() => {
        this.error = 'Error al eliminar el checklist';
      });
    }
    this.mostrarModalEliminar = false;
  }

  // Nuevo método para cancelar eliminación
  cancelarEliminar() {
    this.mostrarModalEliminar = false;
  }
}