import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { MenuComponent } from './Components/menu/menu.component';
import { BackofficeComponent } from './Components/backoffice/backoffice.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { TestComponent } from './Components/test/test.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'backoffice',
    component: BackofficeComponent,
    children: [
      {
        path: 'test',
        component: TestComponent
      },
    ]
  },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: 'test',
        component: TestComponent
      },
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'register',
    component: RegisterUserComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reservation',
    component: ReservationComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
