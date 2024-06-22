import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
  signupForm!: FormGroup;
  user!: User;
  genders = ['Male', 'Female']
  languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano']

  constructor(private fb: FormBuilder, private authSrv: AuthService, private router: Router) { }

  onSubmit(form: FormGroup) {
    console.log(form.value);
    try {
        const { confirmPassword, ...userData } = form.value;
        const newUser: User = { ...userData };
        this.authSrv.signup(newUser).subscribe(() => {
            this.router.navigate(['/login']);
        });
    } catch (error) {
        console.error(error);
    }
}


  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(15)]],
      surname: [null, [Validators.required, Validators.maxLength(15)]],
      email: [null, [Validators.required, Validators.maxLength(25)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      /* confirmPassword: [null, Validators.required], */
      avatar: [/* null, this.fileTypeValidator(['jpeg', 'png', 'gif']) */], // Utilizza la tua funzione di validazione
    }, { validator: this.passwordMatchValidator });
    

    this.signupForm.valueChanges.subscribe(status => {
      /* console.log(status); */
    });
  }

  getErrorsC(name: string, error: string) {
    return this.signupForm.get(name)?.errors![error];
  }

  getFormC(name: string) {
    return this.signupForm.get(name);
  }

  submit() {
        this.user = this.signupForm.value;
        console.log('Oggetto user: ', this.user);
        console.log('Form correttamente inviato');
        this.signupForm.reset();
    }

// Funzione di validazione personalizzata per controllare il tipo di file
fileTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const file = control.value as File;
    if (file instanceof File && file.type) { // Verifica se il file è definito e se ha una proprietà 'type'
      const fileType = file.type.split('/')[1].toLowerCase();
      if (allowedTypes.indexOf(fileType) === -1) {
        return { invalidFileType: true };
      }
    }
    return null; // Restituisci null se non ci sono errori
  };
}




// Funzione di validazione personalizzata per controllare se la password corrisponde al campo di conferma della password
passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword?.setErrors({ passwordMismatch: true });
  } else {
    confirmPassword?.setErrors(null);
  }

  return null;
}
}
