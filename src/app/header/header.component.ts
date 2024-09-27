import { Component } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private foodService: FoodService, private router: Router) {}

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
