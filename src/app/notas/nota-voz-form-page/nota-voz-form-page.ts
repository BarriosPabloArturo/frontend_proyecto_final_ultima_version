import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nota-voz-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nota-voz-form-page.html',
  styleUrl: './nota-voz-form-page.scss'
})
export class NotaVozFormPage implements OnInit {
  titulo: string = '';
  error: string = '';
  exito: string = '';
  voz: string | null = null;
  id: string | null = null;
  editando: boolean = false;
  grabando: boolean = false;
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];

  // Modal de confirmación para eliminar - AGREGAR ESTO
  mostrarModalEliminar: boolean = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.editando = true;
      this.api.obtenerNota(this.id).then(res => {
        const nota = res.data;
        this.titulo = nota.titulo;

        console.log('🎵 Nota completa del backend:', nota);
        console.log('🎵 Campo voz original:', nota.voz);

        if (nota.voz) {
          // Si es una URL blob (temporal), no la modifiques
          if (nota.voz.startsWith('blob:')) {
            console.log('⚠️ URL blob detectada - archivo no disponible');
            this.error = 'El archivo de audio ya no está disponible. Las URLs blob son temporales.';
            this.voz = '';
          } else if (nota.voz.startsWith('data:')) {
            // Es base64, usarlo directamente
            this.voz = nota.voz;
          } else if (nota.voz.startsWith('http')) {
            // Ya es una URL completa
            this.voz = nota.voz;
          } else if (nota.voz.startsWith('/')) {
            // Es una ruta del servidor
            this.voz = `http://localhost:3000${nota.voz}`;
          } else {
            this.error = 'Formato de audio no reconocido';
          }

          console.log('🎵 URL final construida:', this.voz);
        }

      }).catch((err) => {
        console.error('❌ Error al cargar nota:', err);
        this.error = 'Error al cargar la nota de voz';
      });
    }
  }

  async toggleGrabacion() {
    if (!this.grabando) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.voz = URL.createObjectURL(audioBlob);
          this.cdr.detectChanges(); // Fuerza actualización de la vista
        };
        this.mediaRecorder.start();
        this.grabando = true;
      } catch (err) {
        this.error = 'No se pudo acceder al micrófono';
      }
    } else {
      this.mediaRecorder.stop();
      this.grabando = false;
    }
  }

  guardarNotaVoz() {
    if (!this.titulo.trim()) {
      this.error = 'El título es obligatorio';
      return;
    }
    if (!this.voz) {
      this.error = 'Debes grabar una nota de voz';
      return;
    }

    // Convertir la URL blob a base64 para enviar al backend
    this.convertirBlobABase64().then(base64Audio => {
      this.api.crearNota({
        titulo: this.titulo,
        tipo: 'voz',
        voz: base64Audio  // ← Ahora envía el contenido real en base64
      }).then(() => {
        this.exito = 'Nota de voz guardada correctamente';
        this.titulo = '';
        this.voz = null;
        setTimeout(() => this.router.navigate(['/notas']), 1000);
      }).catch(() => {
        this.error = 'Error al guardar la nota de voz';
      });
    }).catch(() => {
      this.error = 'Error al procesar el audio';
    });
  }

  // Método auxiliar para convertir blob URL a base64
  private async convertirBlobABase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.voz || !this.voz.startsWith('blob:')) {
        reject('No hay audio válido para convertir');
        return;
      }

      // Obtener el blob desde la URL
      fetch(this.voz)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            reject('Error al leer el archivo de audio');
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          reject('Error al obtener el blob de audio');
        });
    });
  }

  eliminarNotaVoz() {
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
        this.error = 'Error al eliminar la nota de voz';
      });
    }
    this.mostrarModalEliminar = false;
  }

  // Nuevo método para cancelar eliminación
  cancelarEliminar() {
    this.mostrarModalEliminar = false;
  }

  probarUrl() {
    if (this.voz) {
      console.log('🧪 Probando URL:', this.voz);
      // Intenta abrir la URL en una nueva pestaña
      window.open(this.voz, '_blank');
    }
  }
}