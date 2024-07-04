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
    path: 'backoffice-users',
    component: BackofficeUsersComponent
  },
  {
    path: 'backoffice-employees',
    component: BackofficeEmployeesComponent
  },
  {
    path: 'backoffice-products',
    component: BackofficeProductsComponent
  },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: 'customizeBurger',
        component: CustomizeBurgerComponent
      },
      {
        path: 'fries',
        component: FriesComponent
      },
      {
        path: 'customizeSandwich',
        component: CustomizeSandwichComponent
      },
      {
        path: 'hotdog',
        component: HotdogComponent
      },
      {
        path: 'salad',
        component: SaladComponent
      },
      {
        path: 'dessert',
        component: DessertComponent
      },
      {
        path: 'drink',
        component: DrinkComponent
      },
      {
        path: 'burger',
        component: BurgerComponent
      },
      {
        path: 'sandwich',
        component: SandwichComponent
      }
    ]
  },
  {
    path: 'userSettings',
    component: ProfileSettingsComponent
  },
  {
    path: 'userReservations',
    component: UserReservationsComponent
  },
  {
    path: 'userOrders',
    component: UserCartsComponent
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
