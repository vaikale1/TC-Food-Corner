import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { CartItem, Food, Order, OrderItem } from '../shared/modules/food';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { catchError, EMPTY, of, tap } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HttpClientModule],
templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers:[FoodService]
})
export class CartComponent implements OnInit{


  public cartItems:any;
  public cartItemResponse:any;
  public newFood: Partial<Food> = {};
  public selectedFood: Food | null = null;
  public deleteFood: Food | null = null;
  postFoodForm!:FormGroup;
  isAddFoodModalOpen = false;
 count:number=0;
 public cartitems:CartItem[]=[];
 public tempCartItem:CartItem={};
 public orders: Order[] = [];
  public foodListItems: OrderItem[] = [];
  public foodItem:OrderItem={};
  public listFood:any[]=[];
  public cartId: number | null = null;
  public orderConfirmed: boolean = false;
  public isLoading:boolean=false;

  constructor(private fs: FoodService, private route:Router) {}

  ngOnInit(): void {
    this.getUserCartId();

  }
  public payForOrder(order:Order){
    const totalPrice = this.calculateTotalPrice(this.listFood[this.orders.indexOf(order)] || []);
    console.log(`Initiating payment for Order ID: ${order.orderId} with Total Price: ${totalPrice}`);
    this.route.navigate(['/user/payment'], {
      queryParams: { orderId: order.orderId, totalPrice: totalPrice }
    });
  }

  private getUserCartId(): void {
    const userId = localStorage.getItem('userId');
    console.log('User ID from local storage:', userId);

    if (userId) {
      this.fs.getCartId(+userId).subscribe(
        (id) => {
          this.cartId = id;
          console.log('Cart ID retrieved:', this.cartId);

          if (this.cartId) {
            this.getOrders();
          } else {
            console.error('Cart ID is null or undefined after fetching.');
          }

          this.getCartItem();
        },
        (error) => {
          console.error('Error fetching cart ID:', error);
        }
      );
    } else {
      console.error('User not logged in');
    }
  }

  public getOrders(): void {
    if (this.cartId === null) {
      console.error('Cart ID is not available for fetching orders.');
      return;
    }

    console.log('Fetching orders for Cart ID:', this.cartId);
    this.fs.getAllOrdersUser(this.cartId).subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        console.log('Orders retrieved:', this.orders);
        this.listFood = new Array(orders.length).fill(null);
        this.orders.forEach((order, index) => this.getOrderItemsByOrderId(order.orderId,index));
      },
      (error) => console.error('Error fetching orders:', error)
    );
  }
  public getCartItem(): void {
    if (!this.cartId) {
      console.error('Cart ID is not available.');
      return;
    }

    this.fs.getCartItem(this.cartId).subscribe(
      (response: any) => {
        console.log('Cart Items Response:', response);
        this.cartItems = response;
        this.count = this.cartItems.length;

        this.cartItems.forEach((item: any) => {
          this.fs.getFoodById(item.itemId).subscribe(
            (foodResponse: any) => {
              this.tempCartItem = {
                id: item.id,
                itemId: foodResponse.itemId,
                itemName: foodResponse.itemName,
                price: foodResponse.price,
                quantity: item.quantity,
                itemImage: foodResponse.itemImage
              };
              this.cartitems = [...this.cartitems, this.tempCartItem];
            },
            (error: HttpErrorResponse) => {
              console.error('Error fetching food:', error.message);
              alert(error.message);
            }
          );
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching cart items:', error.message);
        alert(error.message);
      }
    );
  }

  getSubtotal(): number {
    return this.cartitems.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  }
  removeFromCart(id: number | undefined){

    this.fs.removeCartItem(id!).subscribe(data=>{
    })
    setTimeout(() => {
      this.redirecttoSelf();
    },1000);
  }
  redirecttoSelf=()=>{location.reload()}
  confirmOrder(): void {
    if (this.cartId === null) {
      return;
    }

    const orderStatus = 'Pending';

    this.fs.confirmOrder(this.cartId, orderStatus).subscribe(
      response => {
        console.log('Order confirmed:', response);
        alert('Order sent and cart cleared');
        if (this.cartId !== null) {
          this.clearCart();
        }
        this.orderConfirmed = true;
        this.cartItems = [];

      },
      error => {
        console.error('Error confirming order:', error);
        alert('There was an error confirming the order.');
      }
    );
    setTimeout(() => {
      this.redirecttoSelf();
    },1000);
  }
  public clearCart(): void {
    if (!this.cartId) {
        console.error('Cart ID is not available.');
        return;
    }

    this.fs.getCartItem(this.cartId).subscribe(
        (response: any) => {
            console.log('Cart Items Response:', response);
            this.cartItems = response;
            this.count = this.cartItems.length;

            // Clear the cart for each item
            this.cartItems.forEach((item: any) => {
                this.fs.clearCart(item.id).subscribe(
                    () => {
                        console.log(`Successfully cleared item with ID: ${item.id}`);
                    },
                    (error: HttpErrorResponse) => {
                        console.error('Error clearing cart item:', error.message);
                    }
                );
            });
        },
        (error: HttpErrorResponse) => {
            console.error('Error fetching cart items:', error.message);
            alert(error.message);
        }
    );
}

  private getOrderItemsByOrderId(orderId: number, index: number): void {
    console.log('Fetching cart items for order ID:', orderId);
    this.fs.getCartItemsByOrderIdUser(orderId).subscribe(
      (items: OrderItem[]) => {
        console.log('Cart items for order ID:', orderId, items);
        const enrichedItems: OrderItem[] = [];

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
              console.error('Error fetching food details for item ID:', item.itemId, error.message);
              completedRequests++;
            }
          );
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching cart items for order ID:', orderId, error.message);
      }
    );
  }
  calculateTotalPrice(items: OrderItem[] = []): number {
    console.log('Items received for calculation:', items);
    if (!Array.isArray(items)) {
      return 0;
    }
    return items.reduce((total, item) => {
      const price = item.price ?? 0;
      return total + (price * (item.quantity ?? 0));
    }, 0);
  }




}


