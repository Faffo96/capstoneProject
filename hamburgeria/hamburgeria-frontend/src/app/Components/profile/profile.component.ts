import { Component } from '@angular/core';
import { AuthData } from '../../models/auth-data.interface';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user!: AuthData | null;

  constructor(private authSrv: AuthService) {}

  logout() {
      this.authSrv.logout();
  }

}
