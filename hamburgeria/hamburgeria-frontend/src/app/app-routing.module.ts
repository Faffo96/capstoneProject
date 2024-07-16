import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { MenuComponent } from './Components/menu/menu.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { CustomizeBurgerComponent } from './Components/customize-burger/customize-burger.component';
import { FriesComponent } from './Components/fries/fries.component';
import { HotdogComponent } from './Components/hotdog/hotdog.component';
import { SaladComponent } from './Components/salad/salad.component';
import { CustomizeSandwichComponent } from './Components/customize-sandwich/customize-sandwich.component';
import { SandwichComponent } from './Components/sandwich/sandwich.component';
import { DessertComponent } from './Components/dessert/dessert.component';
import { DrinkComponent } from './Components/drink/drink.component';
import { BurgerComponent } from './Components/burger/burger.component';
import { ProfileSettingsComponent } from './Components/profile-settings/profile-settings.component';
import { UserReservationsComponent } from './Components/user-reservations/user-reservations.component';
import { UserCartsComponent } from './Components/user-carts/user-carts.component';
import { BackofficeUsersComponent } from './Components/backoffice-users/backoffice-users.component';
import { BackofficeEmployeesComponent } from './Components/backoffice-employees/backoffice-employees.component';
import { BackofficeProductsComponent } from './Components/backoffice-products/backoffice-products.component';
import { ChiSiamoComponent } from './Components/chi-siamo/chi-siamo.component';
import { GraficiComponent } from './Components/grafici/grafici.component';
import { ShiftsCalendarComponent } from './Components/shifts-calendar/shifts-calendar.component';
import { AuthGuard } from './auth/auth.guard';

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
    path: 'chiSiamo',
    component: ChiSiamoComponent
  },
  {
    path: 'grafici',
    component: GraficiComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shiftsCalendar',
    component: ShiftsCalendarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'backoffice-users',
    component: BackofficeUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'backoffice-employees',
    component: BackofficeEmployeesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'backoffice-products',
    component: BackofficeProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'customizeBurger',
        component: CustomizeBurgerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'fries',
        component: FriesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'customizeSandwich',
        component: CustomizeSandwichComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'hotdog',
        component: HotdogComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'salad',
        component: SaladComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dessert',
        component: DessertComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'drink',
        component: DrinkComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'burger',
        component: BurgerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sandwich',
        component: SandwichComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'userSettings',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'userReservations',
    component: UserReservationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'userOrders',
    component: UserCartsComponent,
    canActivate: [AuthGuard]
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
    component: ReservationComponent,
    canActivate: [AuthGuard]
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
