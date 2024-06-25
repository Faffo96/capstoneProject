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
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './Components/footer/footer.component';

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
    FooterComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
