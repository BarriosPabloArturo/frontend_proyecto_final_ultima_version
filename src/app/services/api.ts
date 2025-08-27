import { Injectable } from '@angular/core';
import api from './api-instance';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  login(correo: string, contrasena: string) {
    return api.post('/auth/login', { correo, contrasena });
  }

  registrar(nombre: string, correo: string, contrasena: string) {
    return api.post('/auth/registrar', { nombre, correo, contrasena });
  }

  obtenerNotas() {
    return api.get('/notas');
  }

  obtenerNota(id: string) {
    return api.get(`/notas/${id}`);
  }

  crearNota(data: any) {
    // data puede tener: { titulo, nota, tipo, items, voz }
    return api.post('/nota', data);
  }

  actualizarNota(id: string, data: any) {
    // data puede tener: { titulo, nota, tipo, items, voz }
    return api.put(`/notas/${id}`, data);
  }

  eliminarNota(id: string) {
    return api.delete(`/notas/${id}`);
  }
}