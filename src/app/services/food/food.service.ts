import { Injectable } from '@angular/core';
import { CartItem, Food, Order, OrderItem, User } from '../../shared/modules/food';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Notification } from './../../shared/modules/notification';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  /*login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/login`, { username, password }, { observe: 'response', withCredentials: true });
  }*/
   public getFoodByIdAdmin(itemID: any) {
      return this.http.get(`${this.apiServerUrl}/admin/getFoodItem/${itemID}`)
    }
  public getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiServerUrl}/admin/home`);
  }
  public getFoodUser(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiServerUrl}/user/showFoodItems`);
  }
  public getFoodUserByCategory(category: string): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiServerUrl}/user/home?category=${category}`);
  }

  public addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(`${this.apiServerUrl}/admin/fooditem/addfooditem`, food);
  }

  public updateFood(food: Food): Observable<Food> {
    return this.http.put<Food>(`${this.apiServerUrl}/admin/fooditem/updatefooditem/${food.itemId}`, food);
  }
  public getCartItemByOrderId(orderId:number):Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/admin/${orderId}/cart-items`)
  }
  public getOrderItems(orderId:number):Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/admin/getOrderItem/${orderId}`)
  }
  public getFoodItemByIdAdmin(foodId:number):Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/admin//getFoodItem/${foodId}`)
  }


  public deleteFood(foodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/admin/fooditem/deleteitem/${foodId}`);
  }
  public getCartItem(cartId: number): Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/user/getCartItems/${cartId}`);
  }
  // public getCartItemByAdmin(){
  //   return this.http.get(`${this.apiServerUrl}/admin/getCartItems/1`);
  // }
  public getFoodById(itemId:number){
    return this.http.get(`${this.apiServerUrl}/user/getFoodItem/${itemId}`)
  }
  public addCartItem(cartId: number, cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/addcartitem/${cartId}`, cartItem);
  }
  public removeCartItem( id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/user/deleteCartitem/${id}`);
  }
  public confirmOrder(cartId: number, orderStatus: string): Observable<any> {
    // Sending a POST request with parameters
    return this.http.post<any>(`${this.apiServerUrl}/user/cart/confirm`, null, {
      params: {
        cartId: cartId.toString(),
        orderStatus: orderStatus
      }
    });
  }
  public getOrderDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/admin/orders/${orderId}`);
  }
  public getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/admin/${id}`);
  }
  public getCartItemsByOrderId(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiServerUrl}/admin/${orderId}/cart-items`);
  }
  public getCartItemsByOrderIdUser(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiServerUrl}/user/${orderId}/cart-items`);
  }
  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiServerUrl}/admin/orders`);
  }
  public getAllOrdersUser(cartId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiServerUrl}/user/orders/cart/${cartId}`);
  }

  public createUser(userdata:any):Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/user/registration`,userdata)
  }
  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    return this.http.post<any>(`${this.apiServerUrl}/login`, loginPayload);
  }
  public logout(): Observable<string> {
    return this.http.post<string>(`${this.apiServerUrl}/logout`, {}, {
      responseType: 'text' as 'json' // Expecting plain text response
    });
  }

  public confirmOrderStatus(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.apiServerUrl}/admin/order/confirm/${orderId}`, {});
  }
  public getNotifications(cartId:number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiServerUrl}/user/notification/${cartId}`);
  }
  public getCartId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/user/${userId}/cartId`);
  }
  public registerUser(userData: { fullName: string; email: string; password: string }): Observable<string> {
    return this.http.post(`${this.apiServerUrl}/register`, userData, { responseType: 'text' });
  }
  public deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/user/notification/${id}`);
  }
  public clearCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiServerUrl}/user/cart/clearcart/${cartItemId}`);
  }
}
