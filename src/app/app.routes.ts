import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { LoginPage } from './auth/login-page/login-page';
import { RegisterPage } from './auth/register-page/register-page';
import { NotasListPage } from './notas/notas-list-page/notas-list-page';
import { NotaFormPage } from './notas/nota-form-page/nota-form-page';
import { NotaDetallePage } from './notas/nota-detalle-page/nota-detalle-page';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
// Importa los nuevos componentes:
import { NotaTipoPage } from './notas/nota-tipo-page/nota-tipo-page';
import { NotaChecklistFormPage } from './notas/nota-checklist-form-page/nota-checklist-form-page';
import { NotaSketchpadFormPage } from './notas/nota-sketchpad-form-page/nota-sketchpad-form-page';
import { NotaVozFormPage } from './notas/nota-voz-form-page/nota-voz-form-page';
import { NotaCalendarioFormPage } from './notas/nota-calendario-form-page/nota-calendario-form-page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  {
    path: '',
    component: DashboardLayout,
    // canActivate: [AuthGuard],
    children: [
      { path: 'notas', component: NotasListPage },
      { path: 'notas/nueva', component: NotaTipoPage },
      { path: 'notas/nueva/texto', component: NotaFormPage },
      { path: 'notas/nueva/checklist', component: NotaChecklistFormPage },
      { path: 'notas/nueva/sketchpad', component: NotaSketchpadFormPage },
      { path: 'notas/nueva/voz', component: NotaVozFormPage },
      { path: 'notas/nueva/calendario', component: NotaCalendarioFormPage }, // ← Agregar esta línea

      // Rutas de edición por tipo de nota:
      { path: 'notas/:id', component: NotaDetallePage },
      { path: 'notas/:id/checklist', component: NotaChecklistFormPage },
      { path: 'notas/:id/sketchpad', component: NotaSketchpadFormPage },
      { path: 'notas/:id/voz', component: NotaVozFormPage },
      { path: 'notas/:id/calendario', component: NotaCalendarioFormPage }, // ← Agregar esta línea
    ],
  }
];