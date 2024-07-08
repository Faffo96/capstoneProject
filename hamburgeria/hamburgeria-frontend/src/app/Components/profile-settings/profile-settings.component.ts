import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { User } from '../../models/user';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {
  user: User | null = null;
  newEmail: string = '';
  newPassword: string = '';
  newName: string = '';
  newSurname: string = '';

  constructor(private userService: UserService, private authService: AuthService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log('User updated:', user);
    });
  }

  updateEmail(): void {
    if (this.user && this.newEmail) {
      this.userService.patchUserEmail(this.user.email, this.newEmail).subscribe(
        updatedUser => {
          this.userService.setUser(updatedUser);
          console.log('Email updated:', updatedUser);
        },
        error => {
          console.error('Error updating email:', error);
        }
      );
    }
  }

  updatePassword(): void {
    if (this.user && this.newPassword) {
      this.userService.patchUserPassword(this.user.email, this.newPassword).subscribe(
        updatedUser => {
          this.userService.setUser(updatedUser);
          console.log('Password updated:', updatedUser);
          this.authService.logout();  // Logout forzato dopo il cambio password
        },
        error => {
          console.error('Error updating password:', error);
        }
      );
    }
  }

  updateName(): void {
    if (this.user && this.newName) {
      this.userService.patchUserName(this.user.email, this.newName).subscribe(
        updatedUser => {
          this.userService.setUser(updatedUser);
          console.log('Name updated:', updatedUser);
        },
        error => {
          console.error('Error updating name:', error);
        }
      );
    }
  }

  updateSurname(): void {
    if (this.user && this.newSurname) {
      this.userService.patchUserSurname(this.user.email, this.newSurname).subscribe(
        updatedUser => {
          this.userService.setUser(updatedUser);
          console.log('Surname updated:', updatedUser);
        },
        error => {
          console.error('Error updating surname:', error);
        }
      );
    }
  }
}