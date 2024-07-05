import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { MenuComponent } from './Components/menu/menu.component';
import { BackofficeComponent } from './Components/backoffice/backoffice.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { HeaderComponent } from './Components/header/header.component';
import { Route, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestComponent } from './Components/test/test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './Components/footer/footer.component';
import { CustomizeBurgerComponent } from './Components/customize-burger/customize-burger.component';
import { FriesComponent } from './Components/fries/fries.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { CartComponent } from './Components/cart/cart.component';
import { HotdogComponent } from './Components/hotdog/hotdog.component';
import { SaladComponent } from './Components/salad/salad.component';
import { SandwichComponent } from './Components/sandwich/sandwich.component';
import { CustomizeSandwichComponent } from './Components/customize-sandwich/customize-sandwich.component';
import { DessertComponent } from './Components/dessert/dessert.component';
import { DrinkComponent } from './Components/drink/drink.component';import { BurgerComponent } from './Components/burger/burger.component';
import { ProfileSettingsComponent } from './Components/profile-settings/profile-settings.component';
import { UserReservationsComponent } from './Components/user-reservations/user-reservations.component';
import { UserCartsComponent } from './Components/user-carts/user-carts.component';
import { DatePipe } from './pipes/date.pipe';
import { CommonModule } from '@angular/common';
import { PriceFormatPipe } from './pipes/price-format.pipe';
import { BackofficeUsersComponent } from './Components/backoffice-users/backoffice-users.component';
import { BackofficeEmployeesComponent } from './Components/backoffice-employees/backoffice-employees.component';
import { BackofficeProductsComponent } from './Components/backoffice-products/backoffice-products.component';
import { ResponseModalComponent } from './Components/response-modal/response-modal.component';
import { ConfirmModalComponent } from './Components/confirm-modal/confirm-modal.component';
import { DateAndTimePipe } from './pipes/date-and-time.pipe';
import { ChiSiamoComponent } from './Components/chi-siamo/chi-siamo.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ReservationComponent,
    MenuComponent,
    BackofficeComponent,
    ProfileComponent,
    TestComponent,
    LoginComponent,
    RegisterUserComponent,
    FooterComponent,
    CustomizeBurgerComponent,
    FriesComponent,
    CartComponent,
    HotdogComponent,
    SaladComponent,
    SandwichComponent,
    CustomizeSandwichComponent,
    DessertComponent,
    DrinkComponent,
    BurgerComponent,
    ProfileSettingsComponent,
    UserReservationsComponent,
    UserCartsComponent,
    DatePipe,
    PriceFormatPipe,
    BackofficeUsersComponent,
    BackofficeEmployeesComponent,
    BackofficeProductsComponent,
    ResponseModalComponent,
    ConfirmModalComponent,
    DateAndTimePipe,
    ChiSiamoComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
