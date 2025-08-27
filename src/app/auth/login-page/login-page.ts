import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  correo = '';
  contrasena = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}
  //this block is used to handle the login functionality, 
  //it uses the api service to call the login method and handle the response
  //if the login is successful, it stores the token in local storage and navigates to the notes page
  //if the login fails, it sets the error message to be displayed
  onLogin() {
    this.api
      .login(this.correo, this.contrasena)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['/notas']);
      })
      .catch((err) => {
        this.error = err.response?.data.msg || 'error al iniciar sesion';
      });
  }
}
