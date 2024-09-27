import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { CartItem, Food, Order, OrderItem } from '../shared/modules/food';
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
  public categories: string[] =[];
  selectedOrder: any;
  isOrderDetailModalOpen = false;
  public expandedOrderId: number | null = null;
  enrichedOrders: (Order & { cartItems: CartItem[] })[] = [];
  items:any;
  count:number=0;
  public orders: Order[] = [];
  public foodListItems: OrderItem[] = [];
  public foodItem:OrderItem={};
  public listFood:any[]=[];
  constructor(private fs: FoodService) {}

  ngOnInit(): void {
    this.getFoods();
    this.loadCategories();
    this.openTab({currentTarget: document.querySelector('.tablinks')}, 'foodList');
    this.getOrders()
  }

getOrders(): void {
  this.fs.getAllOrders().subscribe(
    (orders: Order[]) => {
      this.orders = orders;
      this.listFood = new Array(orders.length).fill(null);
      this.orders.forEach((order, index) => this.getCartItemsByOrderId(order.orderId,index));
    },
    (error) => console.error('Error fetching orders:', error)
  );
}

confirmOrder(orderId: number): void {
  this.fs.confirmOrderStatus(orderId).subscribe(
    (order: Order) => {
      // Handle the successful response
      console.log('Order confirmed:', order);
      this.orders = this.orders.map(o => o.orderId === orderId ? order : o);
    },
    (error) => {
      // Handle error response
      console.error('Error confirming order:', error);
    }
  );
}
private getCartItemsByOrderId(orderId: number, index: number): void {
  this.fs.getCartItemsByOrderId(orderId).subscribe(
    (items: OrderItem[]) => {
      const enrichedItems: OrderItem[] = []; // Declare enrichedItems here
      console.log('Cart items for order ID:', orderId, items);

      let completedRequests = 0;
      const totalRequests = items.length;

      items.forEach(item => {
        this.fs.getFoodByIdAdmin(item.itemId).subscribe(
          (food: any) => {
            enrichedItems.push({
              id: item.id,
              itemId: food.itemId,
              itemName: food.itemName,
              price: food.price,
              quantity: item.quantity,
            });

            completedRequests++;
            if (completedRequests === totalRequests) {
              this.listFood[index] = enrichedItems;
              console.log('Enriched items for order ID:', orderId, enrichedItems);
            }
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching food details:', error.message);
            completedRequests++; // Still need to increment to avoid infinite wait
          }
        );
      });
    },
    (error: HttpErrorResponse) => {
      console.error('Error fetching cart items:', error.message);
    }
  );
}

  public toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null; // Collapse if already expanded
    } else {
      this.expandedOrderId = orderId; // Expand the selected order
    }
  }

  // Angular Component Method (admin.component.ts)
openTab(evt: any, tabName: string): void {
  // Hide all tab content
  const tabContents = document.querySelectorAll('.tabcontent');
  tabContents.forEach((tab: Element) => {
    (tab as HTMLElement).style.display = 'none';
  });

  // Remove the "active" class from all tab links
  const tabLinks = document.querySelectorAll('.tablinks');
  tabLinks.forEach((tabLink: Element) => {
    (tabLink as HTMLElement).classList.remove('active');
  });

  // Show the current tab content
  const currentTab = document.getElementById(tabName);
  if (currentTab) {
    (currentTab as HTMLElement).style.display = 'block';
  }

  // Add the "active" class to the clicked tab link
  (evt.currentTarget as HTMLElement).classList.add('active');
}


  loadCategories(): void {
    // Load categories here if needed
    this.categories = ['Main Course', 'Desserts', 'Appetizers']
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
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.newFood.itemImage = reader.result as string; // Store base64 string
      };

      reader.readAsDataURL(file); // Convert file to base64
    }
  }
}


