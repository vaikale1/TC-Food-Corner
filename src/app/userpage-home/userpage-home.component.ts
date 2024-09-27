import { Component, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { CartItem, Food } from '../shared/modules/food';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartService } from '../services/cart.service';
import { catchError, EMPTY } from 'rxjs';

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
  cartId = 1;
  public tempCartItem:CartItem={};
  constructor(private fs: FoodService,private cartService:CartService) {}

  ngOnInit(): void {
    this.getUserCartId();
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
  private getUserCartId(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.fs.getCartId(+userId).subscribe(
        (id) => {
          this.cartId = id;
          console.log('Cart ID:', this.cartId);
        },
        (error) => {
          console.error('Error fetching cart ID:', error);
        }
      );
    } else {
      console.error('User not logged in');
    }
  }
  public addToCart(foodId: number): void {
    if (this.cartId) { // Ensure cartId is available
      let cartItemBody: any = {
        itemId: foodId
      };
      this.fs.addCartItem(this.cartId, cartItemBody).subscribe(
        (response) => {
          alert("Item added to cart");
        },
        (error: HttpErrorResponse) => {
          console.error('Error adding item to cart:', error);
          alert('Error adding item to cart.');
        }
      );
    } else {
      console.error('Cart ID is not available.');
      alert('Cart ID is not available. Please try again.');
    }
  }




}
