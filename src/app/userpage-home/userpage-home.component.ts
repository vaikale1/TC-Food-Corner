import { Component, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { Food } from '../shared/modules/food';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-userpage-home',
  standalone: true,
  imports: [RouterOutlet,CommonModule,HttpClientModule],
  templateUrl: './userpage-home.component.html',
  styleUrl: './userpage-home.component.css',
  providers:[FoodService]
})
export class UserpageHomeComponent implements OnInit {
  public foods: Food[] = [];
  categories: string[] = ['Main Course', 'Desserts', 'Appetizers'];
  selectedCategory: string = 'Main Course';
  constructor(private fs: FoodService) {}

  ngOnInit(): void {
    this.loadFoodItems(this.selectedCategory);

  }

  loadFoodItems(category: string): void {
    this.fs.getFoodUserByCategory(category).subscribe(data => {
      this.foods = data;
    });
  }
  onTabChange(category: string): void {
    this.selectedCategory = category;
    this.loadFoodItems(category);
  }
  public getFoods(): void {
    this.fs.getFoodUser().subscribe(
      (response: Food[]) => {
        this.foods = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
