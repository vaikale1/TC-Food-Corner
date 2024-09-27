import { Component } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private fs: FoodService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onRegister(): void {
    if (this.registrationForm.valid) {
      const { fullName, email, password } = this.registrationForm.value;

      this.fs.registerUser({ fullName, email, password }).subscribe({
        next: (data: string) => {
          console.log('Registration successful:', data);
          this.router.navigate(['/login']); // Adjust as needed
        },
        error: (err: any) => {
          console.error('Registration error:', err);
          // Handle registration error if necessary
          if (err.status === 400) {
            console.error('Bad Request:', err.error);
          } else if (err.status === 409) {
            console.error('Conflict:', err.error); // e.g., email already in use
          }
        }
      });
    }
  }



}
