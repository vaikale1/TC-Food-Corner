import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { Food } from '../shared/modules/food';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, of, tap } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HttpClientModule],
templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers:[FoodService]
})
export class HomeComponent implements OnInit{

  public foods: Food[] = [];
  public newFood: Partial<Food> = {};
  public selectedFood: Food | null = null;
  public deleteFood: Food | null = null;
  postFoodForm!:FormGroup;
  isAddFoodModalOpen = false;


  constructor(private fs: FoodService) {}

  ngOnInit(): void {
    this.getFoods();

  }

  public getFoods(): void {
    this.fs.getFoods().subscribe(
      (response: Food[]) => {
        this.foods = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddFood(addForm: NgForm): void {
    if (addForm.valid) {
      this.fs.addFood(this.newFood as Food).pipe(
        catchError((error: HttpErrorResponse)=>{
         alert(error.error.message);
return EMPTY;
        })
      ).subscribe(
        (response: Food) => {
          console.log(response);
          this.getFoods();
          addForm.reset();
          this.closeModal('addFoodModal');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          addForm.reset();
        }
      );
    }
  }


  public onUpdateFood() {
    if (this.selectedFood) {
      this.fs.updateFood(this.selectedFood).pipe(
        catchError((error: HttpErrorResponse)=>{
         alert(error.error.message);
return EMPTY;
        })
      ).subscribe(
        (response: Food) => {
          console.log(response);
          this.getFoods();
          this.closeModal('editFoodModal');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

  }

  public onDeleteFood(): void {
    if (this.deleteFood) {
      this.fs.deleteFood(this.deleteFood.itemId).subscribe(
        () => {
          this.getFoods();
          this.closeModal('deleteFoodModal');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public searchFood(value: string): void {
    if (value) {
      this.foods = this.foods.filter(food =>
        food.itemName.toLowerCase().includes(value.toLowerCase()) ||
        food.description.toLowerCase().includes(value.toLowerCase()) ||
        food.category.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.getFoods(); // Reset to all foods if the input is empty
    }
  }

  public onOpenModal(food: Food | null, mode: string): void {
    if (mode === 'add') {
      this.isAddFoodModalOpen=true;
      this.newFood = {}; // Reset new food object
      this.openModal('addFoodModal');
    } else if (mode === 'edit') {
      this.selectedFood = food;
      this.openModal('editFoodModal');
    } else if (mode === 'delete') {
      this.deleteFood = food;
      this.openModal('deleteFoodModal');
    }
  }

  private openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex'; // Show the modal
    }
  }

  public closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none'; // Hide the modal
    }
  }

  public addToCart(food: Food): void {
    // Implement addToCart functionality here
    console.log('Added to cart:', food);
  }

  public cancelEdit(): void {
    this.selectedFood = null;
    this.closeModal('editFoodModal');
  }
}


