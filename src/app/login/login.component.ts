import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodService } from '../services/food/food.service';
import { User, UserRole } from '../shared/modules/food';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.foodService.login(username, password).subscribe({
        next: (data: any) => {
          localStorage.setItem('userId', data.user.userId);
          localStorage.setItem('userRole', data.user.accountType); // Adjust as needed
          // Navigate to the appropriate page
          this.router.navigate([data.redirectUrl]);
        },
        error: (err) => {
          console.error('Login error:', err);
          let alertMessage = 'An error occurred. Please try again.';
          // Handle login error (e.g., show an error message to the user)
          if (err.status === 400) {
            console.error('Bad Request:', err.error);
            alertMessage = 'Invalid username or password.';
          } else if (err.status === 401) {
            console.error('Unauthorized:', err.error);
            alertMessage = 'Unauthorized: Please check your credentials.';
          }
          alert(alertMessage);
        }
      });
    }
  }
  //
  public redirectRegistration(event: MouseEvent) {
    event.preventDefault(); // Prevent the default hyperlink behavior
    this.router.navigateByUrl("registration");
  }

}
