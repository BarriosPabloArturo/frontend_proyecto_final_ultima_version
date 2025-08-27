import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  nombre = '';
  correo = '';
  contrasena = '';
  error = '';
  // This component is used to register a new user
  // It uses the ApiService to call the registrar method and handle the response
  // private api: ApiService is used to inject the ApiService into the component
  // private router: Router is used to navigate to the notes page after successful registration
  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    this.api
      .registrar(this.nombre, this.correo, this.contrasena)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['/notas']); // Redirect to notes page after registration
      })
      .catch((err) => {
        this.error = err.response?.data?.msg || 'Error al registrarse';
      });
  }
}
