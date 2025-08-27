import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router, ActivatedRoute } from '@angular/router';

interface Evento {
  dia: number;
  titulo: string;
  descripcion?: string;
}

@Component({
  selector: 'app-nota-calendario-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nota-calendario-form-page.html',
  styleUrls: ['./nota-calendario-form-page.scss']
})
export class NotaCalendarioFormPage implements OnInit {
  titulo: string = '';
  eventos: Evento[] = [];
  mesActual: Date = new Date();
  diasDelMes: number[] = [];
  editando: boolean = false;
  id: string | null = null;
  error: string = '';
  exito: string = '';

  // Modal para agregar evento
  mostrarModal: boolean = false;
  diaSeleccionado: number = 0;
  nuevoEvento: Evento = { dia: 0, titulo: '', descripcion: '' };

  // Modal de confirmación para eliminar - AGREGAR ESTO
  mostrarModalEliminar: boolean = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.generarDiasDelMes();

    if (this.id) {
      // MODO EDICIÓN: Cargar calendario existente
      this.editando = true;
      this.cargarCalendario();
    } else {
      // MODO CREACIÓN: Buscar si ya existe un calendario para este mes
      this.buscarOCrearCalendarioDelMes();
    }
  }

  private buscarOCrearCalendarioDelMes() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();
    const nombreMes = this.mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    this.api.obtenerNotas().then(res => {
      const calendarioExistente = res.data.find((nota: any) =>
        nota.tipo === 'calendario' &&
        nota.anio === año &&  // ← Cambiar "año" por "anio"
        nota.mes === mes
      );

      if (calendarioExistente) {
        // Redirigir al calendario existente
        this.router.navigate(['/notas', calendarioExistente._id, 'calendario']);
      } else {
        // Crear nuevo calendario para este mes
        this.titulo = `Calendario ${nombreMes}`;
        this.editando = false;
      }
    }).catch(err => {
      // Si hay error, crear nuevo calendario
      this.titulo = `Calendario ${nombreMes}`;
      this.editando = false;
    });
  }

  generarDiasDelMes() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();

    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    // Qué día de la semana es (0 = domingo, 1 = lunes, etc.)
    const diaSemanaInicio = primerDia.getDay();

    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    // Crear array con celdas vacías al inicio + días del mes
    this.diasDelMes = [];

    // Agregar celdas vacías al inicio (para alinear el primer día)
    for (let i = 0; i < diaSemanaInicio; i++) {
      this.diasDelMes.push(0); // 0 = celda vacía
    }

    // Agregar los días del mes
    for (let dia = 1; dia <= ultimoDia; dia++) {
      this.diasDelMes.push(dia);
    }

    console.log(`📅 Julio 2025 empieza un ${primerDia.toLocaleDateString('es-ES', { weekday: 'long' })}`);
    console.log('🗓️ Días generados:', this.diasDelMes);
  }

  cargarCalendario() {
    this.api.obtenerNota(this.id!).then(res => {
      const nota = res.data;
      this.titulo = nota.titulo;
      this.eventos = nota.eventos || [];
    }).catch(() => {
      this.error = 'Error al cargar el calendario';
    });
  }

  abrirModal(dia: number) {
    this.diaSeleccionado = dia;
    this.nuevoEvento = { dia: dia, titulo: '', descripcion: '' };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoEvento = { dia: 0, titulo: '', descripcion: '' };
  }

  agregarEvento() {
    if (!this.nuevoEvento.titulo.trim()) {
      return;
    }

    // Verificar si ya existe un evento en ese día
    const eventoExistente = this.eventos.findIndex(e => e.dia === this.diaSeleccionado);

    if (eventoExistente >= 0) {
      // Reemplazar evento existente
      this.eventos[eventoExistente] = { ...this.nuevoEvento };
    } else {
      // Agregar nuevo evento
      this.eventos.push({ ...this.nuevoEvento });
    }

    this.cerrarModal();
  }

  tieneEvento(dia: number): boolean {
    if (dia === 0) return false; // Celda vacía no tiene eventos
    return this.eventos.some(evento => evento.dia === dia);
  }

  obtenerEvento(dia: number): Evento | undefined {
    return this.eventos.find(evento => evento.dia === dia);
  }

  esHoy(dia: number): boolean {
    if (dia === 0) return false; // Celda vacía no puede ser "hoy"

    const hoy = new Date();
    return dia === hoy.getDate() &&
      this.mesActual.getMonth() === hoy.getMonth() &&
      this.mesActual.getFullYear() === hoy.getFullYear();
  }

  guardarCalendario() {
    if (!this.titulo.trim()) {
      this.error = 'El título es obligatorio';
      return;
    }

    const datosCalendario = {
      titulo: this.titulo,
      tipo: 'calendario',
      eventos: this.eventos,
      mes: this.mesActual.getMonth(),
      anio: this.mesActual.getFullYear()  // ← Cambiar "año" por "anio"
    };

    if (this.editando && this.id) {
      // Actualizar calendario existente
      this.api.actualizarNota(this.id, datosCalendario).then(() => {
        this.exito = 'Calendario actualizado correctamente';
        setTimeout(() => this.router.navigate(['/notas']), 1000);
      }).catch(() => {
        this.error = 'Error al actualizar el calendario';
      });
    } else {
      // Crear nuevo calendario (solo si no existe uno para este mes)
      this.api.crearNota(datosCalendario).then(() => {
        this.exito = 'Calendario creado correctamente';
        setTimeout(() => this.router.navigate(['/notas']), 1000);
      }).catch(() => {
        this.error = 'Error al guardar el calendario';
      });
    }
  }

  eliminarCalendario() {
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
        this.error = 'Error al eliminar el calendario';
      });
    }
    this.mostrarModalEliminar = false;
  }

  // Nuevo método para cancelar eliminación
  cancelarEliminar() {
    this.mostrarModalEliminar = false;
  }
}
