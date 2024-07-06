import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxStripeModule.forRoot('your-publishable-key')
  ]
})
export class StripeModule { }