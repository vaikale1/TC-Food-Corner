import { Component, OnInit } from '@angular/core';
import { Food } from '../shared/modules/food';
import { Notification } from '../shared/modules/notification';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FoodService } from '../services/food/food.service';

@Component({
  selector: 'app-userpage-header',
  standalone: true,
  imports: [CommonModule],
templateUrl: './userpage-header.component.html',
  styleUrl: './userpage-header.component.css'
})
export class UserpageHeaderComponent  implements OnInit{
  isAddFoodModalOpen = false;
  notifications: Notification[] = [];
  showNotifications = false;
  public cartId: number | null = null;

  constructor(private route:Router,private foodService: FoodService){}
  ngOnInit(): void {
    this.getUserCartId();

  }
  private getUserCartId(): void {
    const userId = localStorage.getItem('userId');
    console.log('User ID from local storage:', userId);

    if (userId) {
      this.foodService.getCartId(+userId).subscribe(
        (id) => {
          this.cartId = id; // Directly assign the cart ID
          console.log('Cart ID retrieved:', this.cartId);
          this.fetchNotifications();
        },
        (error) => {
          console.error('Error fetching cart ID:', error);
        }
      );
    } else {
      console.error('User not logged in');
    }
  }


  public fetchNotifications(): void {
    if (this.cartId === null) {
      console.error('Cart ID is not available for fetching orders.');
      return;
    }

    console.log('Fetching orders for Cart ID:', this.cartId);
    this.foodService.getNotifications(this.cartId).subscribe(
      (notifications: Notification[]) => {
        console.log('Fetched notifications:', notifications);
        this.notifications = notifications.map(notification => ({ ...notification, isDeleted: false }));
      },
      (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }
  public toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  public onNotificationClick(notification: Notification): void {
    if (notification.isDeleted) {
      // If already deleted, do nothing
      return;
    }

    // Call the delete service
    this.foodService.deleteNotification(notification.id).subscribe(
      () => {
        // Remove the notification from the array
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        console.log(`Notification with ID ${notification.id} deleted.`);
      },
      (error) => {
        console.error('Error deleting notification:', error);
      }
    );
  }



  public onOpenModal(food: Food | null, mode: string): void {
    if (mode === 'add') {
      this.isAddFoodModalOpen=true;
      this.openModal('addFoodModal');
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
  public redirecToCart(){
    this.route.navigateByUrl("/user/cart")
  }
  public logout(): void {
    this.foodService.logout().subscribe(
        (response: string) => {
            console.log(response); // "Logged out successfully"
            localStorage.clear();
            this.route.navigate(['/login']);
        },
        (error) => {
            console.error('Logout error:', error);
        }
    );
}

}
