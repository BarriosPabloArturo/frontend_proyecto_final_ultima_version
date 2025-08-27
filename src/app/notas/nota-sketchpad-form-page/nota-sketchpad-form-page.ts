import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nota-sketchpad-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nota-sketchpad-form-page.html',
  styleUrl: './nota-sketchpad-form-page.scss'
})
export class NotaSketchpadFormPage implements AfterViewInit, OnInit {
  titulo: string = '';
  nota: string = '';
  error: string = '';
  exito: string = '';
  editando: boolean = false;
  id: string | null = null;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  private dibujando = false;

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
        this.nota = nota.nota;
        // Si hay imagen, dibujarla en el canvas después de AfterViewInit
        setTimeout(() => this.cargarImagenEnCanvas(this.nota), 0);
      }).catch(() => {
        this.error = 'Error al cargar el sketchpad';
      });
    }
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousedown', this.iniciarDibujo.bind(this));
    canvas.addEventListener('mouseup', this.finalizarDibujo.bind(this));
    canvas.addEventListener('mouseout', this.finalizarDibujo.bind(this));
    canvas.addEventListener('mousemove', this.dibujar.bind(this));
  }

  cargarImagenEnCanvas(imagenBase64: string) {
    if (!imagenBase64 || !this.ctx) return;
    const img = new window.Image();
    img.onload = () => {
      this.ctx!.clearRect(0, 0, 400, 300);
      this.ctx!.drawImage(img, 0, 0, 400, 300);
    };
    img.src = imagenBase64;
  }

  iniciarDibujo(event: MouseEvent) {
    this.dibujando = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(event.offsetX, event.offsetY);
  }

  finalizarDibujo() {
    this.dibujando = false;
    this.ctx?.closePath();
  }

  dibujar(event: MouseEvent) {
    if (!this.dibujando || !this.ctx) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  limpiarCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 400, 300);
    }
  }

  guardarSketchpad() {
    this.error = '';
    this.exito = '';
    if (!this.titulo.trim()) {
      this.error = 'El título es obligatorio';
      return;
    }
    const imagen = this.canvasRef.nativeElement.toDataURL(); // base64

    if (this.editando && this.id) {
      // Actualizar nota existente
      this.api.actualizarNota(this.id, {
        titulo: this.titulo,
        tipo: 'sketchpad',
        nota: imagen
      }).then(() => {
        this.router.navigate(['/notas']);
      }).catch(() => {
        this.error = 'Error al actualizar el sketchpad';
      });
    } else {
      // Crear nueva nota
      this.api.crearNota({
        titulo: this.titulo,
        tipo: 'sketchpad',
        nota: imagen
      }).then(() => {
        this.exito = 'Sketchpad guardado correctamente';
        this.titulo = '';
        this.nota = '';
        this.limpiarCanvas();
        setTimeout(() => this.router.navigate(['/notas']), 1000);
      }).catch(() => {
        this.error = 'Error al guardar el sketchpad';
      });
    }
  }

  eliminarSketchpad() {
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
        this.error = 'Error al eliminar el sketchpad';
      });
    }
    this.mostrarModalEliminar = false;
  }

  // Nuevo método para cancelar eliminación
  cancelarEliminar() {
    this.mostrarModalEliminar = false;
  }
}